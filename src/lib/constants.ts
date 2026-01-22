// Discord theme colors
export const DISCORD_COLORS = {
  darker: '#111214',
  dark: '#1e1f22',
  sidebar: '#2b2d31',
  chat: '#313338',
  hover: '#35373c',
  active: '#404249',
  blurple: '#5865f2',
  blurpleHover: '#4752c4',
  green: '#23a559',
  yellow: '#f0b232',
  red: '#da373c',
  textPrimary: '#f2f3f5',
  textSecondary: '#b5bac1',
  textMuted: '#949ba4',
  textLink: '#00a8fc',
  channelIcon: '#80848e',
  divider: '#3f4147',
} as const

// Status colors
export const STATUS_COLORS = {
  online: '#23a559',
  idle: '#f0b232',
  dnd: '#da373c',
  offline: '#80848e',
} as const

// Role colors (default)
export const ROLE_COLORS = {
  owner: '#f47fff',
  admin: '#e74c3c',
  moderator: '#3498db',
  member: undefined,
} as const

// Default images
export const DEFAULT_IMAGES = {
  avatar: '/default-avatar.png',
  serverIcon: '/default-server.png',
} as const

// Time formatting helpers
export function formatMessageTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  if (isToday) {
    return `Today at ${time}`
  }

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${time}`
  }

  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }) + ` ${time}`
}

// Message grouping time threshold (5 minutes)
export const MESSAGE_GROUP_THRESHOLD = 5 * 60 * 1000
