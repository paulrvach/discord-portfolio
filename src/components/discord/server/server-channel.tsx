import { Link } from '@tanstack/react-router'
import { Hash, Volume2, Settings, UserPlus } from 'lucide-react'
import { cn } from '../../../lib/utils'
import type { Doc, Id } from '../../../../convex/_generated/dataModel'

interface ServerChannelProps {
  channel: Doc<'channels'>
  serverId: Id<'servers'>
  isActive: boolean
}

export function ServerChannel({ channel, serverId, isActive }: ServerChannelProps) {
  const Icon = channel.type === 'text' ? Hash : Volume2

  return (
    <Link
      to="/channels/$serverId/$channelId"
      params={{ serverId, channelId: channel._id }}
      className={cn(
        'channel-item group',
        isActive && 'active'
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="truncate flex-1 text-sm">{channel.name}</span>
      
      {/* Action Icons (visible on hover) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-0.5 hover:text-discord-text-primary">
          <UserPlus className="w-4 h-4" />
        </button>
        <button className="p-0.5 hover:text-discord-text-primary">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </Link>
  )
}
