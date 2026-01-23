import { v } from 'convex/values'
import { query } from './_generated/server'

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
