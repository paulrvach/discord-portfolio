import { useMemo, useState } from 'react'
import { MoreHorizontal, Smile, Reply, Pencil, Trash } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { cn } from '../../../lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip'
import type { Doc, Id } from '../../../../convex/_generated/dataModel'

type GitHubEmbed = {
  type: 'github'
  color?: string
  authorName: string
  authorAvatarUrl?: string
  repoName: string
  branchName: string
  title: string
  titleUrl: string
  description?: string
  commitHash?: string
  commitUrl?: string
  footerText?: string
  footerIconUrl?: string
  timestamp?: number
}

interface ChatMessageProps {
  message: Doc<'messages'> & {
    type?: 'user' | 'bot'
    embed?: GitHubEmbed
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

  // Format timestamp
  const formatTime = (timestamp: number) => {
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

  if (isCompact) {
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
          <p className="text-discord-text-primary leading-relaxed">
            {message.content}
            {message.editedAt && (
              <span className="text-[10px] text-discord-text-muted ml-1">
                (edited)
              </span>
            )}
          </p>
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
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-discord-text-primary hover:underline cursor-pointer">
              {message.user.name}
            </span>
            {isBotMessage && (
              <span className="bg-discord-blurple text-white text-[10px] rounded px-1.5 py-0.5">
                BOT
              </span>
            )}
            <span className="text-xs text-discord-text-muted">
              {formatTime(message._creationTime)}
            </span>
          </div>
          {!message.embed && (
            <p className="text-discord-text-primary leading-relaxed">
              {message.content}
              {message.editedAt && (
                <span className="text-[10px] text-discord-text-muted ml-1">
                  (edited)
                </span>
              )}
            </p>
          )}
          {message.embed?.type === 'github' && (
            <div
              className="mt-1 rounded-md bg-discord-dark/60 border-l-4 p-3 space-y-2"
              style={{ borderLeftColor: message.embed.color ?? '#5865F2' }}
            >
              <div className="flex items-center gap-2 text-xs text-discord-text-secondary">
                {message.embed.authorAvatarUrl && (
                  <img
                    src={message.embed.authorAvatarUrl}
                    alt={message.embed.authorName}
                    className="w-4 h-4 rounded-full"
                  />
                )}
                <span className="text-discord-text-primary font-medium">
                  {message.embed.authorName}
                </span>
                <span className="text-discord-text-secondary">
                  pushed to {message.embed.branchName}
                </span>
              </div>

              <a
                href={message.embed.titleUrl}
                className="text-sm font-semibold text-discord-text-primary hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {message.embed.title}
              </a>

              {message.embed.description && (
                <div className="text-sm text-discord-text-primary leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                  >
                    {message.embed.description}
                  </ReactMarkdown>
                </div>
              )}

              {message.embed.commitHash && message.embed.commitUrl && (
                <a
                  href={message.embed.commitUrl}
                  className="text-xs text-discord-text-muted hover:text-discord-text-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  {message.embed.commitHash}
                </a>
              )}

              <div className="flex items-center gap-2 text-[11px] text-discord-text-muted">
                {message.embed.footerIconUrl && (
                  <img
                    src={message.embed.footerIconUrl}
                    alt={message.embed.footerText ?? 'GitHub'}
                    className="w-3 h-3"
                  />
                )}
                <span>{message.embed.footerText ?? 'GitHub'}</span>
                <span>•</span>
                <span>{embedTimeLabel}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hover Actions */}
      {isHovered && <MessageActions />}
    </div>
  )
}

function MessageActions() {
  return (
    <div className="absolute -top-4 right-4 flex items-center gap-0.5 px-1 py-0.5 bg-discord-dark border border-discord-divider rounded shadow-lg">
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1.5 rounded hover:bg-discord-hover text-discord-text-muted hover:text-discord-text-primary">
              <Smile className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-discord-darker border-none">
            <p>Add Reaction</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1.5 rounded hover:bg-discord-hover text-discord-text-muted hover:text-discord-text-primary">
              <Reply className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-discord-darker border-none">
            <p>Reply</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1.5 rounded hover:bg-discord-hover text-discord-text-muted hover:text-discord-text-primary">
              <Pencil className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-discord-darker border-none">
            <p>Edit</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1.5 rounded hover:bg-discord-hover text-discord-text-muted hover:text-discord-red">
              <Trash className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-discord-darker border-none">
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1.5 rounded hover:bg-discord-hover text-discord-text-muted hover:text-discord-text-primary">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-discord-darker border-none">
            <p>More</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
