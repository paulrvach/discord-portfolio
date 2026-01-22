import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

// List all servers (for demo, list all - in real app would filter by membership)
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('servers').collect()
  },
})
//
// Get a server by ID
export const get = query({
  args: { serverId: v.id('servers') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.serverId)
  },
})

// Get server by invite code
export const getByInviteCode = query({
  args: { inviteCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('servers')
      .withIndex('by_invite_code', (q) => q.eq('inviteCode', args.inviteCode))
      .unique()
  },
})

// Get members of a server with user data
export const getMembers = query({
  args: { serverId: v.id('servers') },
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query('members')
      .withIndex('by_server', (q) => q.eq('serverId', args.serverId))
      .collect()

    // Fetch user data for each member
    const membersWithUsers = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId)
        return {
          ...member,
          user: user!,
        }
      })
    )

    return membersWithUsers
  },
})

// Create a new server (for demo, uses provided or first user as owner)
export const create = mutation({
  args: {
    name: v.string(),
    imageUrl: v.optional(v.string()),
    ownerId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    // For demo, use provided ownerId or get first user
    let ownerId = args.ownerId
    if (!ownerId) {
      const users = await ctx.db.query('users').take(1)
      if (!users[0]) throw new Error('No users found - please seed the database')
      ownerId = users[0]._id
    }

    // Generate invite code
    const inviteCode = generateInviteCode()

    // Create the server
    const serverId = await ctx.db.insert('servers', {
      name: args.name,
      imageUrl: args.imageUrl,
      inviteCode,
      ownerId,
    })

    // Add creator as owner member
    await ctx.db.insert('members', {
      userId: ownerId,
      serverId,
      role: 'owner',
    })

    // Create default category
    const categoryId = await ctx.db.insert('categories', {
      serverId,
      name: 'Text Channels',
      order: 0,
    })

    // Create default general channel
    await ctx.db.insert('channels', {
      serverId,
      name: 'general',
      type: 'text',
      categoryId,
      order: 0,
    })

    return serverId
  },
})

// Join a server by invite code
export const join = mutation({
  args: { 
    inviteCode: v.string(),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const server = await ctx.db
      .query('servers')
      .withIndex('by_invite_code', (q) => q.eq('inviteCode', args.inviteCode))
      .unique()

    if (!server) throw new Error('Invalid invite code')

    // Check if already a member
    const existingMember = await ctx.db
      .query('members')
      .withIndex('by_server_and_user', (q) =>
        q.eq('serverId', server._id).eq('userId', args.userId)
      )
      .unique()

    if (existingMember) {
      return server._id // Already a member
    }

    // Add as member
    await ctx.db.insert('members', {
      userId: args.userId,
      serverId: server._id,
      role: 'member',
    })

    return server._id
  },
})

// Helper to generate invite code
function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
