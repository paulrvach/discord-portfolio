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

    const generalChannel = await ctx.db.insert('channels', {
      serverId,
      name: 'general',
      type: 'text',
      categoryId: textCategory,
      topic: 'General discussion for CS38',
      order: 0,
    })

    const homeworkChannel = await ctx.db.insert('channels', {
      serverId,
      name: 'homework-help',
      type: 'text',
      categoryId: textCategory,
      topic: 'Ask questions about assignments',
      order: 1,
    })

    await ctx.db.insert('channels', {
      serverId,
      name: 'projects',
      type: 'text',
      categoryId: textCategory,
      topic: 'Share and discuss your projects',
      order: 2,
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

    // Create sample messages in general channel
    await Promise.all([
      ctx.db.insert('messages', {
        channelId: generalChannel,
        userId: paulId,
        content: 'Welcome to CS38! Excited to have everyone here this semester.',
      }),
      ctx.db.insert('messages', {
        channelId: generalChannel,
        userId: sarahId,
        content: 'Hey everyone! Looking forward to learning together 🎉',
      }),
      ctx.db.insert('messages', {
        channelId: generalChannel,
        userId: alexId,
        content: 'Has anyone started looking at the first assignment yet?',
      }),
      ctx.db.insert('messages', {
        channelId: generalChannel,
        userId: jordanId,
        content: 'I just started! The setup instructions were pretty straightforward.',
      }),
      ctx.db.insert('messages', {
        channelId: generalChannel,
        userId: alexId,
        content: 'Nice! I\'m having some trouble with the dev environment. Anyone using VS Code?',
      }),
      ctx.db.insert('messages', {
        channelId: generalChannel,
        userId: paulId,
        content: 'VS Code works great! Make sure you have the recommended extensions installed.',
      }),
      ctx.db.insert('messages', {
        channelId: generalChannel,
        userId: taylorId,
        content: 'The TypeScript extension is a must-have for this class',
      }),
      ctx.db.insert('messages', {
        channelId: generalChannel,
        userId: jamieId,
        content: 'Just pushed my first commit! This is going to be a fun semester.',
      }),
    ])

    // Add messages to homework channel
    await Promise.all([
      ctx.db.insert('messages', {
        channelId: homeworkChannel,
        userId: alexId,
        content: 'Question about problem 3 - are we supposed to handle edge cases for empty arrays?',
      }),
      ctx.db.insert('messages', {
        channelId: homeworkChannel,
        userId: sarahId,
        content: 'Yes! The spec mentions that we should return null for empty input.',
      }),
      ctx.db.insert('messages', {
        channelId: homeworkChannel,
        userId: alexId,
        content: 'Thanks Sarah! I missed that part.',
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
