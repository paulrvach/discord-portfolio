#!/usr/bin/env bun
/**
 * Delete a markdown message and all its associated storage files.
 *
 * Given a message ID, this script will:
 *   1. Fetch the message to get the markdown storageId
 *   2. Fetch the markdown content from its Convex storage URL
 *   3. Parse all Convex storage URLs referenced in the markdown
 *   4. Delete every referenced asset file from storage
 *   5. Delete the markdown file itself from storage
 *   6. Delete the message document
 *
 * Usage:
 *   bun run scripts/delete-markdown.ts <messageId>
 *
 * Examples:
 *   bun run scripts/delete-markdown.ts j976nre7hq9ngaredzy841j7zd7zmraf
 */

import { ConvexHttpClient } from 'convex/browser'
import { api } from '../convex/_generated/api'
import path from 'node:path'
import fs from 'node:fs'

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------
function parseArgs() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error('Usage: bun run scripts/delete-markdown.ts <messageId>')
    process.exit(1)
  }

  return { messageId: args[0] }
}

// ---------------------------------------------------------------------------
// Read Convex URL from .env.local or environment
// ---------------------------------------------------------------------------
function getConvexUrl(): string {
  let convexUrl = process.env.VITE_CONVEX_URL
  if (!convexUrl) {
    const envPath = path.resolve(
      path.dirname(new URL(import.meta.url).pathname),
      '..',
      '.env.local'
    )
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
  return convexUrl
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const { messageId } = parseArgs()
  const convexUrl = getConvexUrl()
  const client = new ConvexHttpClient(convexUrl)
  console.log(`Connected to Convex: ${convexUrl}`)

  // 1. Fetch the message
  console.log(`\nFetching message: ${messageId}`)
  const message = await client.query(api.messages.getById, {
    messageId: messageId as any,
  })

  if (!message) {
    console.error(`Error: Message "${messageId}" not found`)
    process.exit(1)
  }

  if (message.type !== 'markdown' || !message.markdown?.storageId) {
    console.error(
      `Error: Message "${messageId}" is not a markdown message (type: ${message.type})`
    )
    process.exit(1)
  }

  const mdStorageId = message.markdown.storageId
  console.log(`Message found: type=markdown, storageId=${mdStorageId}`)
  console.log(`Content: "${message.content}"`)

  // 2. Get the markdown file URL and fetch its content
  const mdUrl = await client.query(api.storage.getUrl, {
    storageId: mdStorageId,
  })

  if (!mdUrl) {
    console.error(`Warning: Could not get URL for markdown storageId ${mdStorageId}`)
    console.log('Proceeding to delete the message without cleaning up assets...')
    await client.mutation(api.messages.remove, { messageId: messageId as any })
    console.log('Message deleted.')
    return
  }

  console.log(`Fetching markdown content from: ${mdUrl}`)
  const mdResponse = await fetch(mdUrl)
  if (!mdResponse.ok) {
    console.error(`Warning: Failed to fetch markdown content: ${mdResponse.status}`)
    console.log('Proceeding to delete message and markdown file only...')
    await client.mutation(api.storage.deleteFile, { storageId: mdStorageId as any })
    await client.mutation(api.messages.remove, { messageId: messageId as any })
    console.log('Markdown file and message deleted.')
    return
  }

  const mdContent = await mdResponse.text()

  // 3. Parse all Convex storage URLs from the markdown
  //    URL pattern: https://<deployment>.convex.cloud/api/storage/<uuid>
  const storageUrlRegex =
    /https?:\/\/[^)\s]+\.convex\.cloud\/api\/storage\/[a-f0-9-]+/g
  const storageUrls = [...new Set(mdContent.match(storageUrlRegex) ?? [])]

  console.log(
    `\nFound ${storageUrls.length} Convex storage URL(s) in markdown content.`
  )

  // 4. Build a URL -> storageId mapping from all storage files
  //    Query storage files with a generous limit to cover all assets
  const storageFiles = await client.query(api.storage.listRecent, {
    maxFiles: 1000,
  })

  const urlToStorageId: Record<string, string> = {}
  for (const file of storageFiles) {
    if (file.url) {
      urlToStorageId[file.url] = file._id
    }
  }

  // 5. Delete each referenced asset file
  let deletedAssets = 0
  let failedAssets = 0

  for (const url of storageUrls) {
    const storageId = urlToStorageId[url]
    if (!storageId) {
      console.warn(`  [SKIP] No storageId found for URL: ${url}`)
      failedAssets++
      continue
    }

    process.stdout.write(`  Deleting asset ${storageId}... `)
    try {
      await client.mutation(api.storage.deleteFile, {
        storageId: storageId as any,
      })
      console.log('done')
      deletedAssets++
    } catch (err) {
      console.error(
        `FAILED: ${err instanceof Error ? err.message : err}`
      )
      failedAssets++
    }
  }

  console.log(
    `\nDeleted ${deletedAssets}/${storageUrls.length} asset file(s).`
  )
  if (failedAssets > 0) {
    console.warn(`  ${failedAssets} file(s) could not be deleted.`)
  }

  // 6. Delete the markdown file from storage
  process.stdout.write(`\nDeleting markdown file ${mdStorageId}... `)
  try {
    await client.mutation(api.storage.deleteFile, {
      storageId: mdStorageId as any,
    })
    console.log('done')
  } catch (err) {
    console.error(
      `FAILED: ${err instanceof Error ? err.message : err}`
    )
  }

  // 7. Delete the message document
  process.stdout.write(`Deleting message ${messageId}... `)
  try {
    await client.mutation(api.messages.remove, {
      messageId: messageId as any,
    })
    console.log('done')
  } catch (err) {
    console.error(
      `FAILED: ${err instanceof Error ? err.message : err}`
    )
  }

  console.log('\nDone!')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
