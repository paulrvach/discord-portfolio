import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  // User profiles
  users: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    status: v.union(
      v.literal('online'),
      v.literal('idle'),
      v.literal('dnd'),
      v.literal('offline')
    ),
    customStatus: v.optional(v.string()),
  }),

  // Discord servers
  servers: defineTable({
    name: v.string(),
    imageUrl: v.optional(v.string()),
    inviteCode: v.string(),
    ownerId: v.id('users'),
  }).index('by_invite_code', ['inviteCode']),

  // Server membership (many-to-many: users <-> servers)
  members: defineTable({
    userId: v.id('users'),
    serverId: v.id('servers'),
    role: v.union(
      v.literal('owner'),
      v.literal('admin'),
      v.literal('moderator'),
      v.literal('member')
    ),
    roleColor: v.optional(v.string()), // Hex color for role
  })
    .index('by_user', ['userId'])
    .index('by_server', ['serverId'])
    .index('by_server_and_user', ['serverId', 'userId']),

  // Channel categories
  categories: defineTable({
    serverId: v.id('servers'),
    name: v.string(),
    order: v.number(),
  }).index('by_server', ['serverId']),

  // Channels within a server
  channels: defineTable({
    serverId: v.id('servers'),
    name: v.string(),
    type: v.union(v.literal('text'), v.literal('voice')),
    categoryId: v.optional(v.id('categories')),
    topic: v.optional(v.string()),
    order: v.number(),
  })
    .index('by_server', ['serverId'])
    .index('by_category', ['categoryId']),

  // Messages in channels
  messages: defineTable({
    channelId: v.id('channels'),
    userId: v.optional(v.id('users')),
    content: v.string(),
    attachmentUrl: v.optional(v.string()),
    editedAt: v.optional(v.number()),
    type: v.optional(v.union(v.literal('user'), v.literal('bot'), v.literal('media'), v.literal('audio'))),
    embed: v.optional(
      v.object({
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
    ),
    media: v.optional(
      v.object({
        title: v.string(),
        caption: v.string(),
        tags: v.array(v.string()),
        externalUrl: v.optional(v.string()),
        images: v.array(v.string()),
      })
    ),
    audio: v.optional(
      v.object({
        id: v.string(),
        title: v.string(),
        artist: v.string(),
        duration: v.number(),
        cover: v.optional(v.string()),
        storageId: v.optional(v.id('_storage')),
        url: v.optional(v.string()),
      })
    ),
  }).index('by_channel', ['channelId']),
})
