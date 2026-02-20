import { Hash, Bell, Pin, Users, Search, Inbox, HelpCircle } from 'lucide-react'
import { useUIStore } from '../../../stores/ui-store'
import { cn } from '../../../lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip'
import type { Doc } from '../../../../convex/_generated/dataModel'

interface ChatHeaderProps {
  channel: Doc<'channels'>
}

export function ChatHeader({ channel }: ChatHeaderProps) {
  const { memberListVisible, toggleMemberList } = useUIStore()

  return (
    <div className="h-12 min-h-12 px-4 flex items-center border-b border-discord-divider shadow-sm">
      {/* Channel Info */}
      <div className="flex items-center gap-2 min-w-0">
        <Hash className="w-6 h-6 text-discord-channel-icon flex-shrink-0" />
        <h1 className="font-semibold text-discord-text-primary truncate">
          {channel.name}
        </h1>
        {channel.topic && (
          <>
            <div className="w-px h-6 bg-discord-divider mx-2" />
            <p className="text-sm text-discord-text-muted truncate">
              {channel.topic}
            </p>
          </>
        )}
      </div>

      {/* Toolbar */}
      <div className="ml-auto flex items-center gap-1">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded hover:bg-discord-hover text-discord-text-secondary hover:text-discord-text-primary">
                <Bell className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Notification Settings</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded hover:bg-discord-hover text-discord-text-secondary hover:text-discord-text-primary">
                <Pin className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Pinned Messages</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleMemberList}
                className={cn(
                  'p-2 rounded text-discord-text-secondary hover:text-discord-text-primary',
                  memberListVisible ? 'bg-discord-active' : 'hover:bg-discord-hover'
                )}
              >
                <Users className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{memberListVisible ? 'Hide' : 'Show'} Member List</p>
            </TooltipContent>
          </Tooltip>

          {/* Search */}
          <div className="ml-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-discord-dark rounded text-sm text-discord-text-muted w-36">
              <span className="truncate">Search</span>
              <Search className="w-4 h-4 ml-auto flex-shrink-0" />
            </div>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded hover:bg-discord-hover text-discord-text-secondary hover:text-discord-text-primary">
                <Inbox className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Inbox</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded hover:bg-discord-hover text-discord-text-secondary hover:text-discord-text-primary">
                <HelpCircle className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Help</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
