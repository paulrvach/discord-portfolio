import { useMemo, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { cn } from '../../../lib/utils'
import type { Doc, Id } from '../../../../convex/_generated/dataModel'
import { MessageActions } from './message/message-actions'
import { MessageHeader } from './message/message-header'
import { MessageContent } from './message/message-content'
import { GitHubEmbed } from './message/github-embed'
import { MediaMessage } from './message/media-message'
import type {
  GitHubEmbed as GitHubEmbedType,
  MediaPayload,
} from './message/message-types'

interface ChatMessageProps {
  message: Doc<'messages'> & {
    type?: 'user' | 'bot' | 'media'
    embed?: GitHubEmbedType
    media?: MediaPayload
    user: {
      _id: Id<'users'>
      name: string
      imageUrl?: string
    }
  }
  isCompact: boolean
}

export function ChatMessage({ message, isCompact }: ChatMessageProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isBotMessage = message.type === 'bot' || message.embed?.type === 'github'
  const isMediaMessage = message.type === 'media' && Boolean(message.media)
  const embedTimestamp = message.embed?.timestamp ?? message._creationTime
  const embedTimeLabel = useMemo(
    () => formatTime(embedTimestamp),
    [embedTimestamp]
  )

  // Get user initials
  const initials = message.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const showCompactLayout = isCompact && !isMediaMessage && !message.embed

  if (showCompactLayout) {
    return (
      <div
        className={cn(
          'group relative py-0.5 px-4 -mx-4 hover:bg-discord-hover/50',
          isHovered && 'bg-discord-hover/50'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hover timestamp */}
        <span className="absolute left-4 w-10 text-[10px] text-discord-text-muted opacity-0 group-hover:opacity-100">
          {new Date(message._creationTime).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </span>

        {/* Message content */}
        <div className="pl-14">
          <MessageContent content={message.content} editedAt={message.editedAt} />
        </div>

        {/* Hover Actions */}
        {isHovered && <MessageActions />}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group relative py-1 px-4 -mx-4 mt-4 hover:bg-discord-hover/50',
        isHovered && 'bg-discord-hover/50'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <Avatar className="w-10 h-10 mt-0.5 flex-shrink-0 cursor-pointer hover:opacity-80">
          <AvatarImage src={message.user.imageUrl} />
          <AvatarFallback className="bg-discord-blurple text-white text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <MessageHeader
            name={message.user.name}
            isBotMessage={isBotMessage}
            timeLabel={formatTime(message._creationTime)}
          />

          {!message.embed && !isMediaMessage && (
            <MessageContent content={message.content} editedAt={message.editedAt} />
          )}

          {message.embed?.type === 'github' && (
            <GitHubEmbed embed={message.embed} timeLabel={embedTimeLabel} />
          )}

          {isMediaMessage && message.media && <MediaMessage media={message.media} />}
        </div>
      </div>

      {/* Hover Actions */}
      {isHovered && <MessageActions />}
    </div>
  )
}

// Format timestamp
function formatTime(timestamp: number) {
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

  return (
    date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }) + ` ${time}`
  )
}
