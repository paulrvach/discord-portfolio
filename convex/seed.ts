import { mutation } from './_generated/server'

// Seed the database with demo data
export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingServers = await ctx.db.query('servers').take(1)
    if (existingServers.length > 0) {
      console.log('Database already seeded')
      return { success: false, message: 'Already seeded' }
    }

    // Create demo users
    const users = await Promise.all([
      ctx.db.insert('users', {
        name: 'Paul V',
        email: 'paul@example.com',
        status: 'online',
        customStatus: 'Building cool stuff',
      }),
      ctx.db.insert('users', {
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        status: 'online',
        customStatus: 'what\'s cookin',
      }),
      ctx.db.insert('users', {
        name: 'Alex Kumar',
        email: 'alex@example.com',
        status: 'idle',
        customStatus: 'Tough stuff',
      }),
      ctx.db.insert('users', {
        name: 'Jordan Lee',
        email: 'jordan@example.com',
        status: 'dnd',
        customStatus: 'In a meeting',
      }),
      ctx.db.insert('users', {
        name: 'Taylor Swift',
        email: 'taylor@example.com',
        status: 'online',
      }),
      ctx.db.insert('users', {
        name: 'Morgan Freeman',
        email: 'morgan@example.com',
        status: 'offline',
      }),
      ctx.db.insert('users', {
        name: 'Jamie Rodriguez',
        email: 'jamie@example.com',
        status: 'online',
        customStatus: 'Shipping code',
      }),
    ])

    const [paulId, sarahId, alexId, jordanId, taylorId, morganId, jamieId] = users

    // Create the main demo server
    const serverId = await ctx.db.insert('servers', {
      name: 'CS38 Spring \'26',
      inviteCode: 'cs38demo',
      ownerId: paulId,
    })

    // Add members with different roles
    await Promise.all([
      ctx.db.insert('members', {
        userId: paulId,
        serverId,
        role: 'owner',
        roleColor: '#f47fff',
      }),
      ctx.db.insert('members', {
        userId: sarahId,
        serverId,
        role: 'admin',
        roleColor: '#e74c3c',
      }),
      ctx.db.insert('members', {
        userId: alexId,
        serverId,
        role: 'moderator',
        roleColor: '#3498db',
      }),
      ctx.db.insert('members', {
        userId: jordanId,
        serverId,
        role: 'member',
      }),
      ctx.db.insert('members', {
        userId: taylorId,
        serverId,
        role: 'member',
      }),
      ctx.db.insert('members', {
        userId: morganId,
        serverId,
        role: 'member',
      }),
      ctx.db.insert('members', {
        userId: jamieId,
        serverId,
        role: 'member',
      }),
    ])

    // Create categories
    const infoCategory = await ctx.db.insert('categories', {
      serverId,
      name: 'Information',
      order: 0,
    })

    const textCategory = await ctx.db.insert('categories', {
      serverId,
      name: 'Text Channels',
      order: 1,
    })

    const voiceCategory = await ctx.db.insert('categories', {
      serverId,
      name: 'Voice Channels',
      order: 2,
    })

    // Create channels
    await ctx.db.insert('channels', {
      serverId,
      name: 'rules',
      type: 'text',
      categoryId: infoCategory,
      topic: 'Please read and follow the server rules',
      order: 0,
    })

    await ctx.db.insert('channels', {
      serverId,
      name: 'announcements',
      type: 'text',
      categoryId: infoCategory,
      topic: 'Important updates and announcements',
      order: 1,
    })

    await ctx.db.insert('channels', {
      serverId,
      name: 'projects',
      type: 'text',
      categoryId: textCategory,
      topic: 'Share and discuss your projects',
      order: 0,
    })

    const showcaseChannel = await ctx.db.insert('channels', {
      serverId,
      name: 'showcase',
      type: 'text',
      categoryId: textCategory,
      topic: 'Art, media, and visual experiments',
      order: 1,
    })

    await ctx.db.insert('channels', {
      serverId,
      name: 'Study Room',
      type: 'voice',
      categoryId: voiceCategory,
      order: 0,
    })

    await ctx.db.insert('channels', {
      serverId,
      name: 'Office Hours',
      type: 'voice',
      categoryId: voiceCategory,
      order: 1,
    })

    await ctx.db.insert('channels', {
      serverId,
      name: 'side-projects',
      type: 'text',
      categoryId: textCategory,
      topic: 'Side projects and experiments',
      order: 4,
    })

    // Add media showcase messages
    await Promise.all([
      ctx.db.insert('messages', {
        channelId: showcaseChannel,
        userId: paulId,
        content: 'New series: Neon studies',
        type: 'media',
        media: {
          title: 'Neon Studies',
          caption:
            'Exploring saturated light and glow gradients inspired by city nights.',
          tags: ['digital', 'lighting', '2026'],
          externalUrl: 'https://www.behance.net/',
          images: [
            'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
          ],
        },
      }),
      ctx.db.insert('messages', {
        channelId: showcaseChannel,
        userId: paulId,
        content: 'Short film: Echoes',
        type: 'media',
        media: {
          title: 'Echoes (Short Film)',
          caption:
            'A moody, sound-forward short exploring memory through slow motion.',
          tags: ['film', 'sound design', 'experimental'],
          externalUrl: 'https://vimeo.com/',
          images: [
            'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1600&auto=format&fit=crop',
          ],
        },
      }),
      ctx.db.insert('messages', {
        channelId: showcaseChannel,
        userId: paulId,
        content: 'Sketchbook: Creature Concepts',
        type: 'media',
        media: {
          title: 'Creature Concepts',
          caption:
            'Quick iterative sketches for a speculative wildlife project.',
          tags: ['illustration', 'concept art'],
          externalUrl: 'https://www.artstation.com/',
          images: [
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
          ],
        },
      }),
    ])

    // Create a second demo server
    const server2Id = await ctx.db.insert('servers', {
      name: 'React Developers',
      inviteCode: 'reactdev',
      ownerId: sarahId,
    })

    // Add some members to second server
    await Promise.all([
      ctx.db.insert('members', {
        userId: sarahId,
        serverId: server2Id,
        role: 'owner',
      }),
      ctx.db.insert('members', {
        userId: paulId,
        serverId: server2Id,
        role: 'member',
      }),
      ctx.db.insert('members', {
        userId: jamieId,
        serverId: server2Id,
        role: 'admin',
      }),
    ])

    // Create default category and channel for second server
    const reactTextCategory = await ctx.db.insert('categories', {
      serverId: server2Id,
      name: 'Discussion',
      order: 0,
    })

    await ctx.db.insert('channels', {
      serverId: server2Id,
      name: 'general',
      type: 'text',
      categoryId: reactTextCategory,
      topic: 'General React discussion',
      order: 0,
    })

    await ctx.db.insert('channels', {
      serverId: server2Id,
      name: 'help',
      type: 'text',
      categoryId: reactTextCategory,
      topic: 'Get help with React problems',
      order: 1,
    })

    console.log('Database seeded successfully!')
    return { success: true, message: 'Database seeded' }
  },
})

// Clear all data (for development)
export const clearDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete in order of dependencies
    const messages = await ctx.db.query('messages').collect()
    for (const m of messages) await ctx.db.delete(m._id)

    const channels = await ctx.db.query('channels').collect()
    for (const c of channels) await ctx.db.delete(c._id)

    const categories = await ctx.db.query('categories').collect()
    for (const c of categories) await ctx.db.delete(c._id)

    const members = await ctx.db.query('members').collect()
    for (const m of members) await ctx.db.delete(m._id)

    const servers = await ctx.db.query('servers').collect()
    for (const s of servers) await ctx.db.delete(s._id)

    const users = await ctx.db.query('users').collect()
    for (const u of users) await ctx.db.delete(u._id)

    return { success: true, message: 'Database cleared' }
  },
})
