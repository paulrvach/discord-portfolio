import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { ScrollArea } from '../../ui/scroll-area'
import { ChatMessage } from './chat-message'
import { ChatWelcome } from './chat-welcome'
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

  if (!messages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-discord-text-muted">Loading messages...</div>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 min-h-0 px-4">
      <div className="flex flex-col-reverse pb-4">
        {/* Messages in reverse order for proper scrolling */}
        {messages.map((message: MessageWithUser, index: number) => {
          const prevMessage = messages[index + 1]
          const shouldGroup = prevMessage && shouldGroupMessages(message, prevMessage)

          return (
            <ChatMessage
              key={message._id}
              message={message}
              isCompact={shouldGroup}
            />
          )
        })}

        {/* Welcome message at the top */}
        <ChatWelcome channelName={channelName} />
      </div>
    </ScrollArea>
  )
}

// Helper to determine if messages should be grouped
function shouldGroupMessages(
  current: {
    userId?: Id<'users'>
    _creationTime: number
    type?: 'user' | 'bot' | 'media'
    embed?: { type?: string }
  },
  prev: {
    userId?: Id<'users'>
    _creationTime: number
    type?: 'user' | 'bot' | 'media'
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
