#!/usr/bin/env bun
/**
 * Upload a markdown directory to Convex storage.
 *
 * Scans a directory for a .md file and its referenced assets,
 * uploads each asset to Convex storage, rewrites local file
 * references in the markdown with Convex URLs, then uploads
 * the final markdown file.
 *
 * Usage:
 *   bun run scripts/upload-markdown.ts <directory-path> [--channel <channelId>] [--content <title>]
 *
 * Examples:
 *   bun run scripts/upload-markdown.ts ./my-export
 *   bun run scripts/upload-markdown.ts ./my-export --channel j976nre7hq9ngaredzy841j7zd7zmraf
 *   bun run scripts/upload-markdown.ts ./my-export --channel j976nre7hq9ngaredzy841j7zd7zmraf --content "HW5 - Decisions"
 */

import { ConvexHttpClient } from 'convex/browser'
import { api } from '../convex/_generated/api'
import path from 'node:path'
import fs from 'node:fs'

// ---------------------------------------------------------------------------
// MIME type mapping
// ---------------------------------------------------------------------------
const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.md': 'text/markdown',
  '.txt': 'text/plain',
  '.json': 'application/json',
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  return MIME_TYPES[ext] ?? 'application/octet-stream'
}

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------
function parseArgs() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error('Usage: bun run scripts/upload-markdown.ts <directory-path> [--channel <channelId>] [--content <title>]')
    process.exit(1)
  }

  let dirPath = ''
  let channelId: string | undefined
  let content: string | undefined

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--channel' && args[i + 1]) {
      channelId = args[++i]
    } else if (args[i] === '--content' && args[i + 1]) {
      content = args[++i]
    } else if (!dirPath) {
      dirPath = args[i]
    }
  }

  if (!dirPath) {
    console.error('Error: directory path is required')
    process.exit(1)
  }

  return { dirPath: path.resolve(dirPath), channelId, content }
}

// ---------------------------------------------------------------------------
// Upload a single file to Convex storage
// ---------------------------------------------------------------------------
async function uploadFile(
  client: ConvexHttpClient,
  filePath: string,
  contentType: string
): Promise<{ storageId: string; url: string }> {
  // 1. Get a presigned upload URL
  const uploadUrl: string = await client.mutation(api.storage.generateUploadUrl)

  // 2. Read file and POST to upload URL
  const fileBuffer = fs.readFileSync(filePath)
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': contentType },
    body: fileBuffer,
  })

  if (!response.ok) {
    throw new Error(`Upload failed for ${filePath}: ${response.status} ${response.statusText}`)
  }

  const { storageId } = (await response.json()) as { storageId: string }

  // 3. Get the permanent URL
  const url = await client.query(api.storage.getUrl, { storageId })
  if (!url) {
    throw new Error(`Failed to get URL for storageId: ${storageId}`)
  }

  return { storageId, url }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const { dirPath, channelId, content } = parseArgs()

  // Validate directory exists
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    console.error(`Error: "${dirPath}" is not a valid directory`)
    process.exit(1)
  }

  // Read Convex URL from environment
  // Try .env.local first (dotenv style), then fall back to process.env
  let convexUrl = process.env.VITE_CONVEX_URL
  if (!convexUrl) {
    const envPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '.env.local')
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8')
      const match = envContent.match(/^VITE_CONVEX_URL=(.+)$/m)
      if (match) convexUrl = match[1].trim()
    }
  }
  if (!convexUrl) {
    console.error('Error: VITE_CONVEX_URL not found in environment or .env.local')
    process.exit(1)
  }

  const client = new ConvexHttpClient(convexUrl)
  console.log(`Connected to Convex: ${convexUrl}`)

  // Find the .md file in the directory
  const files = fs.readdirSync(dirPath)
  const mdFiles = files.filter((f) => f.endsWith('.md'))
  if (mdFiles.length === 0) {
    console.error(`Error: No .md file found in "${dirPath}"`)
    process.exit(1)
  }
  if (mdFiles.length > 1) {
    console.log(`Warning: Multiple .md files found, using first: ${mdFiles[0]}`)
  }

  const mdFileName = mdFiles[0]
  const mdFilePath = path.join(dirPath, mdFileName)
  let markdownContent = fs.readFileSync(mdFilePath, 'utf-8')
  console.log(`\nFound markdown: ${mdFileName}`)

  // Parse markdown for image/link references: ![alt](filename)
  const refRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
  const references: { fullMatch: string; alt: string; ref: string }[] = []
  let match: RegExpExecArray | null

  while ((match = refRegex.exec(markdownContent)) !== null) {
    references.push({
      fullMatch: match[0],
      alt: match[1],
      ref: match[2],
    })
  }

  if (references.length === 0) {
    console.log('No file references found in markdown.')
  } else {
    console.log(`Found ${references.length} file reference(s) to upload:\n`)
  }

  // Deduplicate references (same ref might appear multiple times)
  const uniqueRefs = [...new Set(references.map((r) => r.ref))]

  // Upload each referenced file and build a mapping: ref -> convex URL
  const refToUrl: Record<string, string> = {}

  for (const ref of uniqueRefs) {
    // URL-decode the reference to get the actual filename on disk
    const decodedFilename = decodeURIComponent(ref)
    const filePath = path.join(dirPath, decodedFilename)

    if (!fs.existsSync(filePath)) {
      console.warn(`  [SKIP] File not found: ${decodedFilename}`)
      continue
    }

    const contentType = getMimeType(filePath)
    const fileSize = fs.statSync(filePath).size
    const sizeKB = (fileSize / 1024).toFixed(1)

    process.stdout.write(`  Uploading ${decodedFilename} (${sizeKB} KB, ${contentType})... `)

    try {
      const { storageId, url } = await uploadFile(client, filePath, contentType)
      refToUrl[ref] = url
      console.log(`done (${storageId})`)
    } catch (err) {
      console.error(`FAILED: ${err instanceof Error ? err.message : err}`)
    }
  }

  // Replace all local references with Convex URLs
  let rewrittenMarkdown = markdownContent
  for (const { ref } of references) {
    if (refToUrl[ref]) {
      rewrittenMarkdown = rewrittenMarkdown.split(`](${ref})`).join(`](${refToUrl[ref]})`)
    }
  }

  const replacedCount = Object.keys(refToUrl).length
  console.log(`\nReplaced ${replacedCount}/${uniqueRefs.length} file reference(s) in markdown.`)

  // Upload the rewritten markdown file
  console.log('\nUploading rewritten markdown...')
  const { storageId: mdStorageId, url: mdUrl } = await uploadFile(
    client,
    // Write the rewritten content to a temp file for upload
    (() => {
      const tmpPath = path.join(dirPath, `__rewritten_${mdFileName}`)
      fs.writeFileSync(tmpPath, rewrittenMarkdown, 'utf-8')
      return tmpPath
    })(),
    'text/markdown'
  )

  // Clean up temp file
  const tmpPath = path.join(dirPath, `__rewritten_${mdFileName}`)
  if (fs.existsSync(tmpPath)) {
    fs.unlinkSync(tmpPath)
  }

  console.log(`Markdown uploaded: storageId = ${mdStorageId}`)
  console.log(`Markdown URL: ${mdUrl}`)

  // Optionally create a markdown message
  if (channelId) {
    console.log(`\nCreating markdown message in channel ${channelId}...`)
    try {
      const messageId = await client.mutation(api.messages.createMarkdownMessage, {
        channelId: channelId as any,
        storageId: mdStorageId as any,
        content: content ?? mdFileName.replace(/\.md$/, ''),
      })
      console.log(`Message created: ${messageId}`)
    } catch (err) {
      console.error(`Failed to create message: ${err instanceof Error ? err.message : err}`)
    }
  }

  console.log('\nDone!')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
