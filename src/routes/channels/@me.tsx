import { createFileRoute } from '@tanstack/react-router'
import { Users, MessageSquare } from 'lucide-react'

export const Route = createFileRoute('/channels/@me')({
  component: DMHome,
})

function DMHome() {
  return (
    <div className="flex-1 flex">
      {/* DM Sidebar */}
      <div className="w-60 bg-discord-dark flex flex-col">
        {/* Search/Filter */}
        <div className="p-2">
          <button className="w-full px-2 py-1.5 bg-discord-dark rounded text-left text-sm text-discord-text-muted">
            Find or start a conversation
          </button>
        </div>
        
        {/* Friends Link */}
        <div className="px-2 py-1">
          <div className="flex items-center gap-3 px-2 py-2 rounded bg-discord-active text-discord-text-primary">
            <Users className="w-5 h-5" />
            <span className="font-medium">Friends</span>
          </div>
        </div>
        
        {/* Direct Messages Header */}
        <div className="px-4 py-4">
          <h2 className="text-xs font-semibold uppercase text-discord-text-muted tracking-wide">
            Direct Messages
          </h2>
        </div>
        
        {/* DM List - Empty State */}
        <div className="flex-1 px-2">
          <p className="px-2 text-sm text-discord-text-muted">
            No direct messages yet
          </p>
        </div>
      </div>
      
      {/* Friends/DM Content Area */}
      <div className="flex-1 flex flex-col bg-discord-chat">
        {/* Header */}
        <div className="h-12 px-4 flex items-center border-b border-discord-divider shadow-sm">
          <Users className="w-6 h-6 text-discord-text-muted mr-2" />
          <h1 className="font-semibold text-discord-text-primary">Friends</h1>
        </div>
        
        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-48 h-48 mb-8 rounded-full bg-discord-dark flex items-center justify-center">
            <MessageSquare className="w-24 h-24 text-discord-text-muted" />
          </div>
          <p className="text-discord-text-muted text-center max-w-sm">
            Select a server from the sidebar to start chatting, or add a friend to start a direct message.
          </p>
        </div>
      </div>
    </div>
  )
}
