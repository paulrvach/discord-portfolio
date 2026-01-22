import { v } from 'convex/values'
import { query, mutation } from './_generated/server'
import type { Id } from './_generated/dataModel'

const BOT_USER = {
  _id: 'github-bot' as Id<'users'>,
  name: 'GitHub Bot',
  imageUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
}

// List messages for a channel (with user data)
export const listByChannel = query({
  args: { channelId: v.id('channels') },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_channel', (q) => q.eq('channelId', args.channelId))
      .order('desc')
      .take(100)

    // Fetch user data for each message
    const messagesWithUsers = await Promise.all(
      messages.map(async (message) => {
        if (!message.userId) {
          return {
            ...message,
            user: BOT_USER,
          }
        }

        const user = await ctx.db.get(message.userId)
        return {
          ...message,
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
