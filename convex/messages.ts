import { v } from 'convex/values'
import { query, mutation } from './_generated/server'
import type { Id } from './_generated/dataModel'

const BOT_USER = {
  _id: 'github-bot' as Id<'users'>,
  name: 'GitHub Bot',
  imageUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
}

// Get a single message by ID
export const getById = query({
  args: { messageId: v.id('messages') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.messageId)
  },
})

// List messages for a channel (with user data)
export const listByChannel = query({
  args: { channelId: v.id('channels') },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_channel', (q) => q.eq('channelId', args.channelId))
      .order('desc')
      .take(100)

    // Fetch user data and resolve audio/markdown URLs for each message
    const messagesWithUsers = await Promise.all(
      messages.map(async (message) => {
        // Resolve audio URL from storageId if present
        let resolvedAudio = message.audio
        if (message.audio?.storageId && !message.audio.url) {
          const audioUrl = await ctx.storage.getUrl(message.audio.storageId)
          if (audioUrl) {
            resolvedAudio = {
              ...message.audio,
              url: audioUrl,
            }
          }
        }

        // Resolve markdown URL from storageId if present
        let resolvedMarkdown: { storageId: string; url?: string } | undefined =
          undefined
        if (message.markdown?.storageId) {
          const markdownUrl = await ctx.storage.getUrl(message.markdown.storageId)
          resolvedMarkdown = {
            storageId: message.markdown.storageId,
            url: markdownUrl ?? undefined,
          }
        }

        if (!message.userId) {
          return {
            ...message,
            audio: resolvedAudio,
            markdown: resolvedMarkdown ?? message.markdown,
            user: BOT_USER,
          }
        }

        const user = await ctx.db.get(message.userId)
        return {
          ...message,
          audio: resolvedAudio,
          markdown: resolvedMarkdown ?? message.markdown,
          user: {
            _id: user!._id,
            name: user!.name,
            imageUrl: user?.imageUrl,
          },
        }
      })
    )

    return messagesWithUsers
  },
})

// Send a message (for demo, uses provided userId)
export const send = mutation({
  args: {
    channelId: v.id('channels'),
    content: v.string(),
    userId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    // For demo, use provided userId or get first user
    let userId = args.userId
    if (!userId) {
      const users = await ctx.db.query('users').take(1)
      if (!users[0]) throw new Error('No users found - please seed the database')
      userId = users[0]._id
    }

    // Verify channel exists
    const channel = await ctx.db.get(args.channelId)
    if (!channel) throw new Error('Channel not found')

    return await ctx.db.insert('messages', {
      channelId: args.channelId,
      userId: userId,
      content: args.content,
      type: 'user',
    })
  },
})

// Create a media message from storage files
export const createMediaFromStorage = mutation({
  args: {
    channelId: v.id('channels'),
    title: v.string(),
    caption: v.string(),
    tags: v.array(v.string()),
    externalUrl: v.optional(v.string()),
    userId: v.optional(v.id('users')),
    fileIds: v.optional(v.array(v.string())),
    maxFiles: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // For demo, use provided userId or get first user
    let userId = args.userId
    if (!userId) {
      const users = await ctx.db.query('users').take(1)
      if (!users[0]) throw new Error('No users found - please seed the database')
      userId = users[0]._id
    }

    // Verify channel exists
    const channel = await ctx.db.get(args.channelId)
    if (!channel) throw new Error('Channel not found')

    const maxFiles = args.maxFiles ?? 12
    let storageFiles: { _id: string; contentType?: string }[] = []

    if (args.fileIds && args.fileIds.length > 0) {
      const files = await Promise.all(
        args.fileIds.map((id) => ctx.db.system.get(id as any))
      )
      storageFiles = files
        .filter(Boolean)
        .map((file) => ({
          _id: (file as { _id: string })._id,
          contentType: (file as { contentType?: string }).contentType,
        }))
    } else {
      const files = await ctx.db.system
        .query('_storage')
        .order('desc')
        .take(maxFiles)
      storageFiles = files.map((file) => ({
        _id: (file as { _id: string })._id,
        contentType: (file as { contentType?: string }).contentType,
      }))
    }

    const imageFiles = storageFiles.filter((file) =>
      file.contentType?.startsWith('image/')
    )

    if (!imageFiles.length) {
      throw new Error('No image files found in storage')
    }

    const urls = await Promise.all(
      imageFiles.map((file) => ctx.storage.getUrl(file._id as any))
    )
    const images = urls.filter((url): url is string => Boolean(url))

    if (!images.length) {
      throw new Error('No storage URLs available for images')
    }

    return await ctx.db.insert('messages', {
      channelId: args.channelId,
      userId,
      content: args.title,
      type: 'media',
      media: {
        title: args.title,
        caption: args.caption,
        tags: args.tags,
        externalUrl: args.externalUrl,
        images,
      },
    })
  },
})

// Edit a message
export const edit = mutation({
  args: {
    messageId: v.id('messages'),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId)
    if (!message) throw new Error('Message not found')

    await ctx.db.patch(args.messageId, {
      content: args.content,
      editedAt: Date.now(),
    })
  },
})

// Delete a message
export const remove = mutation({
  args: { messageId: v.id('messages') },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId)
    if (!message) throw new Error('Message not found')
    
    await ctx.db.delete(args.messageId)
  },
})

// Update an audio message with a storage ID or external URL
export const updateAudioUrl = mutation({
  args: {
    messageId: v.id('messages'),
    storageId: v.optional(v.id('_storage')),
    externalUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId)
    if (!message) throw new Error('Message not found')
    if (message.type !== 'audio' || !message.audio) {
      throw new Error('Message is not an audio message')
    }

    if (!args.storageId && !args.externalUrl) {
      throw new Error('Either storageId or externalUrl must be provided')
    }

    // Store the storageId and/or external URL
    await ctx.db.patch(args.messageId, {
      audio: {
        ...message.audio,
        storageId: args.storageId ?? message.audio.storageId,
        url: args.externalUrl ?? message.audio.url,
      },
    })

    return { success: true }
  },
})

// Create a media message with explicit image URLs (for CLI sync scripts)
export const createMediaDirect = mutation({
  args: {
    channelId: v.id('channels'),
    title: v.string(),
    caption: v.string(),
    tags: v.array(v.string()),
    externalUrl: v.optional(v.string()),
    imageUrls: v.array(v.string()),
    userId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    let userId = args.userId
    if (!userId) {
      const users = await ctx.db.query('users').take(1)
      if (!users[0]) throw new Error('No users found - please seed the database')
      userId = users[0]._id
    }

    const channel = await ctx.db.get(args.channelId)
    if (!channel) throw new Error('Channel not found')

    if (!args.imageUrls.length) {
      throw new Error('At least one image URL is required')
    }

    return await ctx.db.insert('messages', {
      channelId: args.channelId,
      userId,
      content: args.title,
      type: 'media',
      media: {
        title: args.title,
        caption: args.caption,
        tags: args.tags,
        externalUrl: args.externalUrl,
        images: args.imageUrls,
      },
    })
  },
})

// Create a custom message (for rendering rich React content client-side)
export const createCustomMessage = mutation({
  args: {
    channelId: v.id('channels'),
    content: v.string(),
    userId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    let userId = args.userId
    if (!userId) {
      const users = await ctx.db.query('users').take(1)
      if (!users[0]) throw new Error('No users found - please seed the database')
      userId = users[0]._id
    }

    const channel = await ctx.db.get(args.channelId)
    if (!channel) throw new Error('Channel not found')

    return await ctx.db.insert('messages', {
      channelId: args.channelId,
      userId,
      content: args.content,
      type: 'custom',
    })
  },
})

// Append images to an existing media message
export const appendMediaImages = mutation({
  args: {
    messageId: v.id('messages'),
    imageUrls: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId)
    if (!message) throw new Error('Message not found')
    if (message.type !== 'media' || !message.media) {
      throw new Error('Message is not a media message')
    }

    await ctx.db.patch(args.messageId, {
      media: {
        ...message.media,
        images: [...message.media.images, ...args.imageUrls],
      },
      editedAt: Date.now(),
    })

    return args.messageId
  },
})

// Create a markdown message from a stored .md file
export const createMarkdownMessage = mutation({
  args: {
    channelId: v.id('channels'),
    storageId: v.id('_storage'),
    content: v.optional(v.string()),
    userId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    // For demo, use provided userId or get first user
    let userId = args.userId
    if (!userId) {
      const users = await ctx.db.query('users').take(1)
      if (!users[0]) throw new Error('No users found - please seed the database')
      userId = users[0]._id
    }

    // Verify channel exists
    const channel = await ctx.db.get(args.channelId)
    if (!channel) throw new Error('Channel not found')

    return await ctx.db.insert('messages', {
      channelId: args.channelId,
      userId,
      content: args.content ?? '📄 Markdown Document',
      type: 'markdown',
      markdown: {
        storageId: args.storageId,
      },
    })
  },
})

// Create an audio message from storage
export const createAudioMessage = mutation({
  args: {
    channelId: v.id('channels'),
    title: v.string(),
    artist: v.string(),
    duration: v.number(),
    storageId: v.id('_storage'),
    coverUrl: v.optional(v.string()),
    userId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    // For demo, use provided userId or get first user
    let userId = args.userId
    if (!userId) {
      const users = await ctx.db.query('users').take(1)
      if (!users[0]) throw new Error('No users found - please seed the database')
      userId = users[0]._id
    }

    // Verify channel exists
    const channel = await ctx.db.get(args.channelId)
    if (!channel) throw new Error('Channel not found')

    const audioId = `audio-${Date.now()}`

    return await ctx.db.insert('messages', {
      channelId: args.channelId,
      userId,
      content: `🎵 ${args.title}`,
      type: 'audio',
      audio: {
        id: audioId,
        title: args.title,
        artist: args.artist,
        duration: args.duration,
        cover: args.coverUrl,
        storageId: args.storageId,
      },
    })
  },
})
