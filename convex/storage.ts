import { v } from 'convex/values'
import { query, mutation } from './_generated/server'
import type { Id } from './_generated/dataModel'

// Generate an upload URL for file uploads
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  },
})

// Get a file URL by storage ID. Returns null if the file doesn't exist (e.g. ID from another deployment).
export const getUrl = query({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const url = await ctx.storage.getUrl(args.storageId as Id<'_storage'>)
      return url
    } catch {
      return null
    }
  },
})

// Delete a file from storage by its storage ID
export const deleteFile = mutation({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.storageId)
  },
})

// List recent storage files with signed URLs
export const listRecent = query({
  args: {
    maxFiles: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const maxFiles = args.maxFiles ?? 20
    const files = await ctx.db.system
      .query('_storage')
      .order('desc')
      .take(maxFiles)

    const results = await Promise.all(
      files.map(async (file) => {
        const storageId = (file as { _id: string })._id
        const url = await ctx.storage.getUrl(storageId as any)
        return {
          _id: storageId,
          _creationTime: (file as { _creationTime: number })._creationTime,
          contentType: (file as { contentType?: string }).contentType,
          size: (file as { size?: number }).size,
          url,
        }
      })
    )

    return results
  },
})
