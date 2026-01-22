import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

// List channels for a server
export const listByServer = query({
  args: { serverId: v.id('servers') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('channels')
      .withIndex('by_server', (q) => q.eq('serverId', args.serverId))
      .collect()
  },
})

// Get a channel by ID
export const get = query({
  args: { channelId: v.id('channels') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.channelId)
  },
})

// Create a channel
export const create = mutation({
  args: {
    serverId: v.id('servers'),
    name: v.string(),
    type: v.union(v.literal('text'), v.literal('voice')),
    categoryId: v.optional(v.id('categories')),
    topic: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get max order for channels in this server (or category)
    const channels = await ctx.db
      .query('channels')
      .withIndex('by_server', (q) => q.eq('serverId', args.serverId))
      .collect()

    const relevantChannels = args.categoryId
      ? channels.filter((c) => c.categoryId === args.categoryId)
      : channels.filter((c) => !c.categoryId)

    const maxOrder = relevantChannels.reduce((max, ch) => Math.max(max, ch.order), -1)

    // Normalize channel name (lowercase, hyphens)
    const normalizedName = args.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    return await ctx.db.insert('channels', {
      serverId: args.serverId,
      name: normalizedName,
      type: args.type,
      categoryId: args.categoryId,
      topic: args.topic,
      order: maxOrder + 1,
    })
  },
})

// Update a channel
export const update = mutation({
  args: {
    channelId: v.id('channels'),
    name: v.optional(v.string()),
    topic: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: { name?: string; topic?: string } = {}

    if (args.name) {
      updates.name = args.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
    }

    if (args.topic !== undefined) {
      updates.topic = args.topic
    }

    await ctx.db.patch(args.channelId, updates)
  },
})

// Delete a channel
export const remove = mutation({
  args: { channelId: v.id('channels') },
  handler: async (ctx, args) => {
    // Delete all messages in the channel
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_channel', (q) => q.eq('channelId', args.channelId))
      .collect()

    for (const message of messages) {
      await ctx.db.delete(message._id)
    }

    await ctx.db.delete(args.channelId)
  },
})
