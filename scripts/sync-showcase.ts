#!/usr/bin/env bun
/**
 * Sync Showcase — Media sync automation for Discord Portfolio
 *
 * Scans the /showcase directory, compares against manifest.json,
 * and uploads new files to Convex storage + creates/updates messages.
 *
 * Usage:
 *   bun run scripts/sync-showcase.ts
 */

import { ConvexHttpClient } from 'convex/browser'
import { api } from '../convex/_generated/api'
import path from 'node:path'
import fs from 'node:fs'
import { select, input, confirm } from '@inquirer/prompts'

// ─── Constants ──────────────────────────────────────────────────────────────

const PROJECT_ROOT = process.cwd()
const SHOWCASE_DIR = path.join(PROJECT_ROOT, 'showcase')
const MANIFEST_PATH = path.join(SHOWCASE_DIR, 'manifest.json')
const INDEX_PATH = path.join(SHOWCASE_DIR, 'index.md')

/** Message types sourced from convex/schema.ts (lines 69-76) */
const MESSAGE_TYPES = ['user', 'bot', 'media', 'audio', 'markdown'] as const
type MessageType = (typeof MESSAGE_TYPES)[number]

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.heic': 'image/heic',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.flac': 'audio/flac',
  '.md': 'text/markdown',
  '.txt': 'text/plain',
  '.json': 'application/json',
  '.pdf': 'application/pdf',
}

const EXT_TO_TYPE: Record<string, MessageType> = {
  '.png': 'media',
  '.jpg': 'media',
  '.jpeg': 'media',
  '.gif': 'media',
  '.webp': 'media',
  '.svg': 'media',
  '.bmp': 'media',
  '.heic': 'media',
  '.mp3': 'audio',
  '.wav': 'audio',
  '.ogg': 'audio',
  '.flac': 'audio',
  '.md': 'markdown',
}

const IGNORED_FILES = new Set([
  'manifest.json',
  'index.md',
  '.gitkeep',
  '.DS_Store',
  'Thumbs.db',
])

// ─── Types ──────────────────────────────────────────────────────────────────

interface ManifestEntry {
  convexMessageId: string
  files: string[]
  channelId: string
  messageType: string
}

type Manifest = Record<string, ManifestEntry>

interface FolderDiff {
  name: string
  allFiles: string[]
  newFiles: string[]
  isNew: boolean
}

interface UploadResult {
  file: string
  storageId: string
  url: string
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  return MIME_TYPES[ext] ?? 'application/octet-stream'
}

function suggestMessageType(files: string[]): MessageType {
  const counts = Object.fromEntries(
    MESSAGE_TYPES.map((t) => [t, 0])
  ) as Record<MessageType, number>

  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    const type = EXT_TO_TYPE[ext]
    if (type) counts[type]++
  }

  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  return (best && best[1] > 0 ? best[0] : 'media') as MessageType
}

function titleCase(str: string): string {
  return str
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

// ─── Manifest ───────────────────────────────────────────────────────────────

function loadManifest(): Manifest {
  if (!fs.existsSync(MANIFEST_PATH)) return {}
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'))
  } catch {
    console.warn('  Warning: Could not parse manifest.json, starting fresh.')
    return {}
  }
}

function deepMergeManifest(
  existing: Manifest,
  folderName: string,
  entry: ManifestEntry
): Manifest {
  const prev = existing[folderName]
  return {
    ...existing,
    [folderName]: {
      convexMessageId: entry.convexMessageId,
      channelId: entry.channelId,
      messageType: entry.messageType,
      files: [...new Set([...(prev?.files ?? []), ...entry.files])],
    },
  }
}

function saveManifest(manifest: Manifest): void {
  fs.writeFileSync(
    MANIFEST_PATH,
    JSON.stringify(manifest, null, 2) + '\n',
    'utf-8'
  )
}

// ─── Index.md Task List ─────────────────────────────────────────────────────

function loadIndex(): string {
  if (!fs.existsSync(INDEX_PATH)) return ''
  return fs.readFileSync(INDEX_PATH, 'utf-8')
}

function updateIndexWithPending(diffs: FolderDiff[]): void {
  let content = loadIndex()
  if (!content) content = '# Showcase Sync Tasks\n\n'

  for (const diff of diffs) {
    for (const file of diff.newFiles) {
      const line = `- [ ] Upload: ${diff.name}/${file}`
      if (!content.includes(line)) content += line + '\n'
    }
  }

  fs.writeFileSync(INDEX_PATH, content, 'utf-8')
}

function markTasksComplete(folderName: string, files: string[]): void {
  let content = loadIndex()
  if (!content) return

  for (const file of files) {
    content = content.replace(
      `- [ ] Upload: ${folderName}/${file}`,
      `- [x] Upload: ${folderName}/${file}`
    )
  }

  fs.writeFileSync(INDEX_PATH, content, 'utf-8')
}

// ─── File System Scanning ───────────────────────────────────────────────────

function ensureShowcaseDir(): void {
  if (!fs.existsSync(SHOWCASE_DIR)) {
    fs.mkdirSync(SHOWCASE_DIR, { recursive: true })
    console.log(`  Created showcase directory: ${SHOWCASE_DIR}`)
  }
}

function scanShowcase(): Map<string, string[]> {
  const folders = new Map<string, string[]>()
  if (!fs.existsSync(SHOWCASE_DIR)) return folders

  for (const entry of fs.readdirSync(SHOWCASE_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue

    const folderPath = path.join(SHOWCASE_DIR, entry.name)
    const files = fs
      .readdirSync(folderPath)
      .filter((f) => {
        if (IGNORED_FILES.has(f)) return false
        return fs.statSync(path.join(folderPath, f)).isFile()
      })
      .sort()

    if (files.length > 0) folders.set(entry.name, files)
  }

  return folders
}

function computeDiffs(
  folders: Map<string, string[]>,
  manifest: Manifest
): FolderDiff[] {
  const diffs: FolderDiff[] = []

  for (const [name, files] of folders) {
    const existing = manifest[name]
    if (!existing) {
      diffs.push({ name, allFiles: files, newFiles: files, isNew: true })
    } else {
      const known = new Set(existing.files)
      const newFiles = files.filter((f) => !known.has(f))
      if (newFiles.length > 0) {
        diffs.push({ name, allFiles: files, newFiles, isNew: false })
      }
    }
  }

  return diffs
}

// ─── Convex Client ──────────────────────────────────────────────────────────

function createConvexClient(): ConvexHttpClient {
  let convexUrl = process.env.VITE_CONVEX_URL

  if (!convexUrl) {
    const envPath = path.join(PROJECT_ROOT, '.env.local')
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8')
      const match = envContent.match(/^VITE_CONVEX_URL=(.+)$/m)
      if (match) convexUrl = match[1].trim()
    }
  }

  if (!convexUrl) {
    console.error(
      'Error: VITE_CONVEX_URL not found in environment or .env.local'
    )
    process.exit(1)
  }

  console.log(`  Convex: ${convexUrl}`)
  return new ConvexHttpClient(convexUrl)
}

async function uploadFileToConvex(
  client: ConvexHttpClient,
  filePath: string
): Promise<{ storageId: string; url: string }> {
  const contentType = getMimeType(filePath)
  const uploadUrl: string = await client.mutation(
    api.storage.generateUploadUrl
  )

  const fileBuffer = fs.readFileSync(filePath)
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': contentType },
    body: fileBuffer,
  })

  if (!response.ok) {
    throw new Error(
      `Upload failed: ${response.status} ${response.statusText}`
    )
  }

  const { storageId } = (await response.json()) as { storageId: string }
  const url = await client.query(api.storage.getUrl, { storageId })
  if (!url) throw new Error(`Failed to resolve URL for storageId: ${storageId}`)

  return { storageId, url }
}

async function fetchChannels(
  client: ConvexHttpClient
): Promise<{ _id: string; name: string; serverName: string }[]> {
  try {
    return (await client.query(api.channels.listAll)) as any[]
  } catch {
    console.warn('  Could not fetch channels from Convex.')
    return []
  }
}

// ─── Upload Files ───────────────────────────────────────────────────────────

async function uploadFolderFiles(
  client: ConvexHttpClient,
  diff: FolderDiff
): Promise<UploadResult[]> {
  const results: UploadResult[] = []
  const folderPath = path.join(SHOWCASE_DIR, diff.name)

  for (let i = 0; i < diff.newFiles.length; i++) {
    const file = diff.newFiles[i]
    const filePath = path.join(folderPath, file)
    const fileSize = fs.statSync(filePath).size
    const sizeKB = (fileSize / 1024).toFixed(1)
    const contentType = getMimeType(filePath)

    process.stdout.write(
      `  [${i + 1}/${diff.newFiles.length}] ${file} (${sizeKB} KB, ${contentType})... `
    )

    try {
      const { storageId, url } = await uploadFileToConvex(client, filePath)
      results.push({ file, storageId, url })
      console.log(`done (${storageId})`)
    } catch (err) {
      console.error(`FAILED: ${err instanceof Error ? err.message : err}`)
    }
  }

  return results
}

// ─── Message Creators ───────────────────────────────────────────────────────

async function handleMedia(
  client: ConvexHttpClient,
  diff: FolderDiff,
  uploads: UploadResult[],
  channelId: string,
  manifest: Manifest
): Promise<string> {
  const imageUrls = uploads
    .filter((u) => {
      const ext = path.extname(u.file).toLowerCase()
      return getMimeType(path.join(SHOWCASE_DIR, diff.name, u.file)).startsWith(
        'image/'
      )
    })
    .map((u) => u.url)

  if (imageUrls.length === 0) {
    throw new Error('No image files among the uploads')
  }

  const existing = manifest[diff.name]

  // Append to existing media message
  if (existing && !diff.isNew) {
    console.log(
      `\n  Appending ${imageUrls.length} image(s) to existing message...`
    )
    await client.mutation(api.messages.appendMediaImages, {
      messageId: existing.convexMessageId as any,
      imageUrls,
    })
    console.log('  Done.')
    return existing.convexMessageId
  }

  // New media message — gather metadata
  const title = await input({
    message: 'Media title:',
    default: titleCase(diff.name),
  })

  const caption = await input({
    message: 'Caption:',
    default: `Showcase: ${title}`,
  })

  const tagsRaw = await input({
    message: 'Tags (comma-separated):',
    default: diff.name.replace(/-/g, ', '),
  })
  const tags = tagsRaw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const externalUrl = await input({
    message: 'External URL (optional, press Enter to skip):',
    default: '',
  })

  console.log(`\n  Creating media message with ${imageUrls.length} image(s)...`)
  const messageId = await client.mutation(api.messages.createMediaDirect, {
    channelId: channelId as any,
    title,
    caption,
    tags,
    externalUrl: externalUrl || undefined,
    imageUrls,
  })
  console.log(`  Message created: ${messageId}`)
  return messageId as string
}

async function handleAudio(
  client: ConvexHttpClient,
  diff: FolderDiff,
  uploads: UploadResult[],
  channelId: string
): Promise<string> {
  const audioUploads = uploads.filter((u) => {
    const ext = path.extname(u.file).toLowerCase()
    return ['.mp3', '.wav', '.ogg', '.flac'].includes(ext)
  })

  if (audioUploads.length === 0) {
    throw new Error('No audio files among the uploads')
  }

  // Look for a cover image in the folder
  const folderPath = path.join(SHOWCASE_DIR, diff.name)
  let coverUrl: string | undefined
  const coverFile = diff.allFiles.find((f) => {
    const ext = path.extname(f).toLowerCase()
    return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext)
  })
  if (coverFile) {
    try {
      process.stdout.write(`  Uploading cover image ${coverFile}... `)
      const result = await uploadFileToConvex(
        client,
        path.join(folderPath, coverFile)
      )
      coverUrl = result.url
      console.log('done')
    } catch {
      console.log('skipped (upload failed)')
    }
  }

  let lastMessageId = ''

  for (const upload of audioUploads) {
    const ext = path.extname(upload.file)
    const baseName = path.basename(upload.file, ext)

    const title = await input({
      message: `Title for "${upload.file}":`,
      default: titleCase(baseName),
    })
    const artist = await input({
      message: 'Artist:',
      default: 'Unknown Artist',
    })
    const durationStr = await input({
      message: 'Duration (seconds):',
      default: '180',
    })
    const duration = parseInt(durationStr, 10) || 180

    console.log(`  Creating audio message for "${title}"...`)
    const messageId = await client.mutation(api.messages.createAudioMessage, {
      channelId: channelId as any,
      title,
      artist,
      duration,
      storageId: upload.storageId as any,
      coverUrl,
    })
    console.log(`  Message created: ${messageId}`)
    lastMessageId = messageId as string
  }

  return lastMessageId
}

async function handleMarkdown(
  client: ConvexHttpClient,
  uploads: UploadResult[],
  channelId: string
): Promise<string> {
  const mdUploads = uploads.filter((u) => u.file.endsWith('.md'))

  if (mdUploads.length === 0) {
    throw new Error('No markdown files among the uploads')
  }

  let lastMessageId = ''

  for (const upload of mdUploads) {
    const baseName = path.basename(upload.file, '.md')
    const content = await input({
      message: `Title for "${upload.file}":`,
      default: titleCase(baseName),
    })

    console.log(`  Creating markdown message for "${content}"...`)
    const messageId = await client.mutation(
      api.messages.createMarkdownMessage,
      {
        channelId: channelId as any,
        storageId: upload.storageId as any,
        content,
      }
    )
    console.log(`  Message created: ${messageId}`)
    lastMessageId = messageId as string
  }

  return lastMessageId
}

async function handleTextMessage(
  client: ConvexHttpClient,
  diff: FolderDiff,
  channelId: string
): Promise<string> {
  const content = await input({
    message: 'Message content:',
    default: titleCase(diff.name),
  })

  console.log('  Creating text message...')
  const messageId = await client.mutation(api.messages.send, {
    channelId: channelId as any,
    content,
  })
  console.log(`  Message created: ${messageId}`)
  return messageId as string
}

// ─── Channel Selection ──────────────────────────────────────────────────────

async function selectChannel(client: ConvexHttpClient): Promise<string> {
  const channels = await fetchChannels(client)

  if (channels.length === 0) {
    return await input({ message: 'Enter channel ID:' })
  }

  const choices = [
    ...channels.map((ch) => ({
      name: `#${ch.name} (${ch.serverName})`,
      value: ch._id,
    })),
    { name: '[ Enter channel ID manually ]', value: '__manual__' },
  ]

  const choice = await select({
    message: 'Select target channel:',
    choices,
  })

  if (choice === '__manual__') {
    return await input({ message: 'Enter channel ID:' })
  }

  return choice
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════╗')
  console.log('║     Showcase Sync CLI        ║')
  console.log('╚══════════════════════════════╝\n')

  ensureShowcaseDir()

  const client = createConvexClient()
  console.log()

  // ── Discovery ──
  console.log('Scanning showcase directory...\n')
  const folders = scanShowcase()

  if (folders.size === 0) {
    console.log(
      'No subdirectories found in showcase/.\n' +
        'Add folders with files and run again.\n'
    )
    return
  }

  const manifest = loadManifest()
  const diffs = computeDiffs(folders, manifest)

  // ── Status display ──
  console.log(`Found ${folders.size} subdirectory(ies):\n`)
  for (const [name, files] of folders) {
    const diff = diffs.find((d) => d.name === name)
    const entry = manifest[name]
    if (!entry) {
      console.log(`  + ${name}  (new, ${files.length} files)`)
    } else if (diff) {
      console.log(
        `  ~ ${name}  (${diff.newFiles.length} new file${diff.newFiles.length > 1 ? 's' : ''})`
      )
    } else {
      console.log(`  = ${name}  (synced, ${files.length} files)`)
    }
  }
  console.log()

  if (diffs.length === 0) {
    console.log('Everything is synced. Nothing to do!\n')
    return
  }

  // ── Task Generation ──
  updateIndexWithPending(diffs)
  const totalTasks = diffs.reduce((sum, d) => sum + d.newFiles.length, 0)
  console.log(`Updated index.md with ${totalTasks} pending task(s).\n`)

  // ── Sync Loop ──
  let continueSync = true

  while (continueSync && diffs.length > 0) {
    // ── Folder Selection ──
    const folderChoice = await select({
      message: 'Select folder to sync:',
      choices: diffs.map((d) => ({
        name: `${d.name} (${d.newFiles.length} new file${d.newFiles.length > 1 ? 's' : ''})`,
        value: d.name,
      })),
    })

    const diff = diffs.find((d) => d.name === folderChoice)!

    // ── Message Type ──
    let messageType: MessageType

    if (!diff.isNew && manifest[diff.name]?.messageType) {
      messageType = manifest[diff.name].messageType as MessageType
      console.log(`  Using existing message type: ${messageType}`)
    } else {
      const suggested = suggestMessageType(diff.newFiles)
      messageType = await select({
        message: 'Message type:',
        choices: MESSAGE_TYPES.map((t) => ({
          name: t === suggested ? `${t} (suggested)` : t,
          value: t,
        })),
        default: suggested,
      })
    }

    // ── Channel Selection ──
    let channelId: string

    if (!diff.isNew && manifest[diff.name]?.channelId) {
      channelId = manifest[diff.name].channelId
      console.log(`  Using existing channel: ${channelId}`)
    } else {
      channelId = await selectChannel(client)
    }

    // ── File Upload ──
    console.log('\nUploading files...\n')
    const uploads = await uploadFolderFiles(client, diff)

    if (uploads.length === 0) {
      console.error(
        '\nNo files were successfully uploaded. Skipping message creation.\n'
      )
      const shouldContinue =
        diffs.length > 1
          ? await confirm({
              message: 'Continue with another folder?',
              default: false,
            })
          : false
      if (!shouldContinue) break
      continue
    }

    // ── Message Creation ──
    let messageId: string

    try {
      switch (messageType) {
        case 'media':
          messageId = await handleMedia(
            client,
            diff,
            uploads,
            channelId,
            manifest
          )
          break
        case 'audio':
          messageId = await handleAudio(client, diff, uploads, channelId)
          break
        case 'markdown':
          messageId = await handleMarkdown(client, uploads, channelId)
          break
        case 'user':
        case 'bot':
          messageId = await handleTextMessage(client, diff, channelId)
          break
        default:
          throw new Error(`Unsupported message type: ${messageType}`)
      }
    } catch (err) {
      console.error(
        `\n  Error: ${err instanceof Error ? err.message : err}`
      )
      console.error('  Manifest NOT updated for this folder.\n')
      const shouldContinue =
        diffs.length > 1
          ? await confirm({
              message: 'Continue with another folder?',
              default: false,
            })
          : false
      if (!shouldContinue) break
      continue
    }

    // ── Cleanup: Update manifest (deep merge) ──
    const uploadedFiles = uploads.map((u) => u.file)
    const updatedManifest = deepMergeManifest(manifest, diff.name, {
      convexMessageId: messageId,
      files: uploadedFiles,
      channelId,
      messageType,
    })

    saveManifest(updatedManifest)
    Object.assign(manifest, updatedManifest)
    console.log('\n  Updated manifest.json')

    // ── Cleanup: Mark tasks complete ──
    markTasksComplete(diff.name, uploadedFiles)
    console.log(`  Marked ${uploadedFiles.length} task(s) complete in index.md`)

    // Remove synced diff
    const idx = diffs.findIndex((d) => d.name === diff.name)
    if (idx !== -1) diffs.splice(idx, 1)

    if (diffs.length > 0) {
      console.log()
      continueSync = await confirm({
        message: 'Sync another folder?',
        default: true,
      })
    } else {
      continueSync = false
    }
  }

  console.log('\nDone!\n')
}

main().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})
