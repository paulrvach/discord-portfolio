import { createFileRoute, useParams } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { ChatHeader } from '../../../components/discord/chat/chat-header'
import { ChatMessages } from '../../../components/discord/chat/chat-messages'
import { ChatInput } from '../../../components/discord/chat/chat-input'
import type { Id } from '../../../../convex/_generated/dataModel'

export const Route = createFileRoute('/channels/$serverId/$channelId')({
  component: ChannelPage,
})

function ChannelPage() {
  const { channelId } = useParams({ 
    strict: false 
  })
  
  // Fetch channel data
  const channel = useQuery(api.channels.get, { 
    channelId: channelId as Id<'channels'> 
  })

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-discord-text-muted">Loading channel...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col w-content min-w-0">
      {/* Chat Header */}
      <ChatHeader channel={channel} />
      
      {/* Messages Area */}
      <ChatMessages 
        channelId={channelId as Id<'channels'>} 
        channelName={channel.name}
      />
      
      {/* Message Input */}
      <ChatInput 
        channelId={channelId as Id<'channels'>}
        channelName={channel.name}
      />
    </div>
  )
}
