import { httpAction } from './_generated/server'
import { v } from 'convex/values'
import type { Id } from './_generated/dataModel'
import { internalMutation } from './_generated/server'
import { internal } from './_generated/api'

const GITHUB_FOOTER_ICON =
  'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'

const githubEmbedValidator = v.object({
  type: v.literal('github'),
  color: v.optional(v.string()),
  authorName: v.string(),
  authorAvatarUrl: v.optional(v.string()),
  repoName: v.string(),
  branchName: v.string(),
  title: v.string(),
  titleUrl: v.string(),
  description: v.optional(v.string()),
  commitHash: v.optional(v.string()),
  commitUrl: v.optional(v.string()),
  footerText: v.optional(v.string()),
  footerIconUrl: v.optional(v.string()),
  timestamp: v.optional(v.number()),
})

export const insertGitHubCommit = internalMutation({
  args: {
    channelId: v.id('channels'),
    content: v.string(),
    embed: githubEmbedValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('messages', {
      channelId: args.channelId,
      content: args.content,
      type: 'bot',
      embed: args.embed,
    })
  },
})

export const githubWebhook = httpAction(async (ctx, request) => {
  const eventType = request.headers.get('x-github-event') ?? ''
  if (eventType !== 'push') {
    return new Response('Ignored', { status: 202 })
  }

  const secret = process.env.GITHUB_WEBHOOK_SECRET
  if (!secret) {
    return new Response('Missing webhook secret', { status: 500 })
  }

  const signature = request.headers.get('x-hub-signature-256') ?? ''
  const bodyText = await request.text()

  const isValid = await verifySignature(secret, signature, bodyText)
  if (!isValid) {
    return new Response('Invalid signature', { status: 401 })
  }

  let payload: any
  try {
    payload = JSON.parse(bodyText)
  } catch (error) {
    return new Response('Invalid JSON', { status: 400 })
  }

  const channelId = process.env.GITHUB_ACTIVITY_CHANNEL_ID
  if (!channelId) {
    return new Response('Missing channel configuration', { status: 500 })
  }

  const commits = Array.isArray(payload.commits) ? payload.commits : []
  if (commits.length === 0) {
    return new Response('No commits', { status: 200 })
  }

  const repoName =
    payload.repository?.full_name ?? payload.repository?.name ?? 'unknown/repo'
  const repoUrl = payload.repository?.html_url ?? ''
  const branchName = extractBranchName(payload.ref)
  const authorAvatarUrl = payload.sender?.avatar_url

  await Promise.all(
    commits.map((commit: any) => {
      const commitId = typeof commit.id === 'string' ? commit.id : ''
      const shortHash = commitId ? commitId.slice(0, 7) : undefined
      const commitUrl = commitId && repoUrl ? `${repoUrl}/commit/${commitId}` : undefined
      const authorName =
        commit.author?.username ??
        commit.author?.name ??
        payload.pusher?.name ??
        'unknown'
      const message = typeof commit.message === 'string' ? commit.message : ''
      const timestamp = commit.timestamp
        ? new Date(commit.timestamp).getTime()
        : Date.now()

      return ctx.runMutation(internal.github.insertGitHubCommit, {
        channelId: channelId as Id<'channels'>,
        content: message,
        embed: {
          type: 'github',
          color: '#8b5cf6',
          authorName,
          authorAvatarUrl,
          repoName,
          branchName,
          title: `${repoName}:${branchName}`,
          titleUrl: repoUrl ? `${repoUrl}/tree/${branchName}` : repoUrl,
          description: message,
          commitHash: shortHash,
          commitUrl,
          footerText: 'GitHub',
          footerIconUrl: GITHUB_FOOTER_ICON,
          timestamp,
        },
      })
    })
  )

  return new Response('OK', { status: 200 })
})

function extractBranchName(ref: string | undefined) {
  if (!ref) return 'main'
  const parts = ref.split('/')
  return parts[parts.length - 1] || 'main'
}

async function verifySignature(
  secret: string,
  signatureHeader: string,
  body: string
) {
  if (!signatureHeader.startsWith('sha256=')) {
    return false
  }
  const signature = signatureHeader.slice('sha256='.length)
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signed = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(body)
  )
  const expected = toHex(signed)
  return signature === expected
}

function toHex(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}
