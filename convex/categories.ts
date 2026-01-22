import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

// List categories for a server
export const listByServer = query({
  args: { serverId: v.id('servers') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('categories')
      .withIndex('by_server', (q) => q.eq('serverId', args.serverId))
      .collect()
  },
})

// Create a category
export const create = mutation({
  args: {
    serverId: v.id('servers'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Get max order for this server's categories
    const categories = await ctx.db
      .query('categories')
      .withIndex('by_server', (q) => q.eq('serverId', args.serverId))
      .collect()

    const maxOrder = categories.reduce((max, cat) => Math.max(max, cat.order), -1)

    return await ctx.db.insert('categories', {
      serverId: args.serverId,
      name: args.name,
      order: maxOrder + 1,
    })
  },
})

// Update category name
export const update = mutation({
  args: {
    categoryId: v.id('categories'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.categoryId, { name: args.name })
  },
})

// Delete a category (moves channels to uncategorized)
export const remove = mutation({
  args: { categoryId: v.id('categories') },
  handler: async (ctx, args) => {
    // Remove category reference from all channels
    const channels = await ctx.db
      .query('channels')
      .withIndex('by_category', (q) => q.eq('categoryId', args.categoryId))
      .collect()

    for (const channel of channels) {
      await ctx.db.patch(channel._id, { categoryId: undefined })
    }

    await ctx.db.delete(args.categoryId)
  },
})
