import { useMemo, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { cn } from '../../../lib/utils'
import type { Doc, Id } from '../../../../convex/_generated/dataModel'
import { MessageActions } from './message/message-actions'
import { MessageHeader } from './message/message-header'
import { MessageContent } from './message/message-content'
import { GitHubEmbed } from './message/github-embed'
import { MediaMessage } from './message/media-message'
import { AudioMessage } from '@/components/discord/chat/message/audio-message'
import { MarkdownMessage } from './message/markdown-message'
import { CustomMessage } from './message/custom-message'
import type {
  GitHubEmbed as GitHubEmbedType,
  MediaPayload,
  AudioPayload,
  MarkdownPayload,
} from './message/message-types'

interface ChatMessageProps {
  message: Omit<Doc<'messages'>, 'type'> & {
    type?: 'user' | 'bot' | 'media' | 'audio' | 'markdown' | 'custom'
    embed?: GitHubEmbedType
    media?: MediaPayload
    audio?: AudioPayload
    markdown?: MarkdownPayload
    user: {
      _id: Id<'users'>
      name: string
      imageUrl?: string
    }
  }
  isCompact: boolean
  children?: React.ReactNode
}

export function ChatMessage({ message, isCompact, children }: ChatMessageProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isBotMessage = message.type === 'bot' || message.embed?.type === 'github'
  const isMediaMessage = message.type === 'media' && Boolean(message.media)
  const isAudioMessage = message.type === 'audio' && Boolean(message.audio)
  const isMarkdownMessage = message.type === 'markdown' && Boolean(message.markdown)
  const isCustomMessage = message.type === 'custom'
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

  const showCompactLayout =
    isCompact &&
    !isMediaMessage &&
    !isAudioMessage &&
    !isMarkdownMessage &&
    !isCustomMessage &&
    !message.embed

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
        {isHovered && <MessageActions copyText={message.content} />}
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
        <Avatar className="w-10 h-10 mt-0.5  cursor-pointer hover:opacity-80">
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

          {!message.embed && !isMediaMessage && !isAudioMessage && !isMarkdownMessage && !isCustomMessage && (
            <MessageContent content={message.content} editedAt={message.editedAt} />
          )}

          {message.embed?.type === 'github' && (
            <GitHubEmbed embed={message.embed} timeLabel={embedTimeLabel} />
          )}

          {isMediaMessage && message.media && <MediaMessage media={message.media} />}
          {isAudioMessage && message.audio && <AudioMessage audio={message.audio} />}
          {isMarkdownMessage && message.markdown && (
            <MarkdownMessage markdown={message.markdown} />
          )}
          {isCustomMessage && <CustomMessage>{children}</CustomMessage>}
        </div>
      </div>

      {/* Hover Actions */}
      {isHovered && <MessageActions copyText={message.content} />}
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
