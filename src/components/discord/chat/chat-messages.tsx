import { useCallback, useEffect, useRef } from 'react'
import { useQuery } from 'convex/react'
import { ChevronDown } from 'lucide-react'
import { api } from '../../../../convex/_generated/api'
import { ScrollArea } from '../../ui/scroll-area'
import { ChatMessage } from './chat-message'
import { ChatWelcome } from './chat-welcome'
import { ChatMessagesSkeleton } from './chat-skeleton'
import { useChatStore } from '../../../stores/chat-store'
import type { Doc, Id } from '../../../../convex/_generated/dataModel'

interface ChatMessagesProps {
  channelId: Id<'channels'>
  channelName: string
}

type MessageWithUser = Doc<'messages'> & {
  user: {
    _id: Id<'users'>
    name: string
    imageUrl?: string
  }
}

export function ChatMessages({ channelId, channelName }: ChatMessagesProps) {
  // Fetch messages for this channel
  const messages = useQuery(api.messages.listByChannel, { channelId })
  const scrollRootRef = useRef<HTMLDivElement>(null)
  const showJumpToLatest = useChatStore((state) => state.showJumpToLatest)
  const setShowJumpToLatest = useChatStore((state) => state.setShowJumpToLatest)
  const initializedChannelId = useChatStore((state) => state.initializedChannelId)
  const setInitializedChannelId = useChatStore((state) => state.setInitializedChannelId)
  const messageCount = messages?.length ?? 0
  const latestMessageId = messages?.[0]?._id
  const channelIdKey = String(channelId)

  useEffect(() => {
    setShowJumpToLatest(false)
  }, [channelIdKey, setShowJumpToLatest])

  const scrollToLatest = useCallback((behavior: ScrollBehavior = 'auto') => {
    const viewport = getViewport(scrollRootRef.current)
    if (!viewport) return
    viewport.scrollTo({ top: viewport.scrollHeight, behavior })
  }, [])

  useEffect(() => {
    const viewport = getViewport(scrollRootRef.current)
    if (!viewport) return

    const handleScroll = () => {
      const distanceFromLatest =
        viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight
      setShowJumpToLatest(distanceFromLatest > 120)
    }

    handleScroll()
    viewport.addEventListener('scroll', handleScroll)
    return () => viewport.removeEventListener('scroll', handleScroll)
  }, [channelId, messageCount])

  useEffect(() => {
    if (!messages || !messages.length) return

    const viewport = getViewport(scrollRootRef.current)
    if (!viewport) return

    const isChannelSwitch = initializedChannelId !== channelIdKey
    const distanceFromLatest =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight
    const isNearLatest = distanceFromLatest <= 120
    if (!isChannelSwitch && !isNearLatest) return

    // Wait for layout/embeds to settle before applying initial position.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToLatest('auto'))
    })
    setInitializedChannelId(channelIdKey)
  }, [
    channelId,
    channelIdKey,
    initializedChannelId,
    latestMessageId,
    messageCount,
    messages,
    scrollToLatest,
    setInitializedChannelId,
  ])

  if (!messages) {
    return (
      <div className="flex-1 min-h-0">
        <ChatMessagesSkeleton />
      </div>
    )
  }

  return (
    <div className="relative flex-1 min-h-0" ref={scrollRootRef}>
      <ScrollArea className="h-full px-4">
        <div className="flex flex-col-reverse pb-4">
          {/* Messages in reverse order for proper scrolling */}
          {messages.map((message: MessageWithUser, index: number) => {
            const prevMessage = messages[index + 1]
            const shouldGroup = prevMessage && shouldGroupMessages(message, prevMessage)
            const showDateDivider = shouldShowDateDivider(message, prevMessage)

            return (
              <div key={message._id}>
                <ChatMessage message={message} isCompact={Boolean(shouldGroup)} />
                {showDateDivider && (
                  <DateDivider timestamp={message._creationTime} />
                )}
              </div>
            )
          })}

          {/* Welcome message at the top */}
          <ChatWelcome channelName={channelName} />
          {messages.length === 0 && (
            <p className="pb-4 text-sm text-discord-text-muted">
              No messages yet. Start the conversation.
            </p>
          )}
        </div>
      </ScrollArea>

      {showJumpToLatest && (
        <button
          type="button"
          onClick={() => scrollToLatest('smooth')}
          className="absolute bottom-4 right-6 inline-flex items-center gap-1 rounded-full border border-discord-divider bg-discord-dark px-3 py-1.5 text-xs font-medium text-discord-text-secondary shadow-lg hover:text-discord-text-primary"
        >
          <ChevronDown className="h-3.5 w-3.5" />
          Jump to latest
        </button>
      )}
    </div>
  )
}

// Helper to determine if messages should be grouped
function shouldGroupMessages(
  current: {
    userId?: Id<'users'>
    _creationTime: number
    type?: 'user' | 'bot' | 'media' | 'audio'
    embed?: { type?: string }
  },
  prev: {
    userId?: Id<'users'>
    _creationTime: number
    type?: 'user' | 'bot' | 'media' | 'audio'
    embed?: { type?: string }
  }
): boolean {
  if (current.type === 'bot' || prev.type === 'bot') return false
  if (current.type === 'media' || prev.type === 'media') return false
  if (current.embed?.type === 'github' || prev.embed?.type === 'github') return false
  // Different users = don't group
  if (current.userId !== prev.userId) return false

  // More than 5 minutes apart = don't group
  const timeDiff = current._creationTime - prev._creationTime
  const fiveMinutes = 5 * 60 * 1000
  return timeDiff < fiveMinutes
}

function shouldShowDateDivider(
  current: { _creationTime: number },
  prev?: { _creationTime: number }
) {
  if (!prev) return true

  const currentDate = new Date(current._creationTime).toDateString()
  const prevDate = new Date(prev._creationTime).toDateString()
  return currentDate !== prevDate
}

function DateDivider({ timestamp }: { timestamp: number }) {
  return (
    <div className="relative my-4 flex items-center">
      <div className="h-px flex-1 bg-discord-divider" />
      <span className="mx-3 rounded-md border border-discord-divider bg-card px-2 py-0.5 text-xs text-discord-text-muted">
        {formatDateLabel(timestamp)}
      </span>
      <div className="h-px flex-1 bg-discord-divider" />
    </div>
  )
}

function formatDateLabel(timestamp: number) {
  const date = new Date(timestamp)
  const now = new Date()
  const today = now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function getViewport(root: HTMLElement | null): HTMLElement | null {
  if (!root) return null
  return root.querySelector('[data-slot="scroll-area-viewport"]')
}
