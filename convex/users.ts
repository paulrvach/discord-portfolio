import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

// Get a user by ID
export const get = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId)
  },
})

// Get current user - for demo, returns first user (Paul V)
export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    // For demo purposes, return the first user
    const users = await ctx.db.query('users').take(1)
    return users[0] ?? null
  },
})

// Update user status
export const updateStatus = mutation({
  args: {
    userId: v.id('users'),
    status: v.union(
      v.literal('online'),
      v.literal('idle'),
      v.literal('dnd'),
      v.literal('offline')
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { status: args.status })
  },
})

// Update custom status
export const updateCustomStatus = mutation({
  args: {
    userId: v.id('users'),
    customStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { customStatus: args.customStatus })
  },
})
