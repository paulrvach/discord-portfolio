import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { cn } from '../../../lib/utils'
import type { Doc, Id } from '../../../../convex/_generated/dataModel'

interface MemberItemProps {
  member: Doc<'members'> & {
    user: {
      _id: Id<'users'>
      name: string
      imageUrl?: string
      status: 'online' | 'idle' | 'dnd' | 'offline'
      customStatus?: string
    }
  }
  roleColor?: string
  isOffline?: boolean
}

const STATUS_COLORS = {
  online: 'bg-discord-green',
  idle: 'bg-discord-yellow',
  dnd: 'bg-discord-red',
  offline: 'bg-discord-text-muted',
}

export function MemberItem({ member, roleColor, isOffline }: MemberItemProps) {
  const { user } = member

  // Get initials
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <button
      className={cn(
        'w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-discord-hover group',
        isOffline && 'opacity-50'
      )}
    >
      {/* Avatar with Status */}
      <div className="relative flex-shrink-0">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user.imageUrl} />
          <AvatarFallback className="bg-discord-blurple text-white text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        {/* Status Indicator */}
        <div
          className={cn(
            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-discord-dark',
            STATUS_COLORS[user.status]
          )}
        />
      </div>

      {/* Name and Status */}
      <div className="flex-1 min-w-0 text-left">
        <p
          className="text-sm font-medium truncate group-hover:text-discord-text-primary"
          style={{ color: roleColor || 'var(--discord-text-secondary)' }}
        >
          {user.name}
        </p>
        {user.customStatus && (
          <p className="text-xs text-discord-text-muted truncate">
            {user.customStatus}
          </p>
        )}
      </div>
    </button>
  )
}
