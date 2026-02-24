import { Mic, Headphones, Settings } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui/popover'
import { useModalStore } from '../../../stores/modal-store'
import { useAudioPlayerStore } from '../../../stores/audio-player-store'
import { useIdentityStore } from '../../../stores/identity-store'
import { cn } from '../../../lib/utils'
import { UserProfileCard } from './user-profile-card'

export function UserPanel() {
  const openModal = useModalStore((state) => state.openModal)
  const isAudioPlayerActive = useAudioPlayerStore((state) => state.isActive && state.playlist.length > 0)
  const avatarUrl = useIdentityStore((s) => s.avatarUrl)

  const user = {
    name: 'Paul V',
    username: 'paulrvach',
    status: 'online' as const,
    customStatus: 'Buildin cool stuff',
    location: 'Orange County, CA',
    bio: 'Another Day in Pizza Paradise 🍕',
    memberSince: 'Dec 3, 2016',
    links: [
      { label: 'github', url: 'https://github.com/paulrvach' },
      { label: 'website', url: 'https://paulvachon.dev/' },
      { label: 'twitter', url: 'https://twitter.com/paulvdev' },
    ],
    roles: [
      { label: 'Software Engineer', color: '#10B981' },
      { label: 'Builder', color: '#8B5CF6' },
      { label: 'Audiophile', color: '#EC4899' },
      { label: 'Gamer', color: '#F97316' },
      { label: 'Artist', color: '#EF4444' },
      { label: 'CS Student', color: '#06B6D4' },
    ],
    connections: [
      { platform: 'LinkedIn', username: 'paul-vachon', url: 'https://linkedin.com/in/paul-vachon' },
      { platform: 'GitHub', username: 'paulrvach', url: 'https://github.com/paulrvach' },
    ],
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className={cn(
      "h-[52px] px-2 py-8 bg-card border flex items-center gap-2 border-discord-divider w-full shadow",
      isAudioPlayerActive ? "border-t-0 rounded-b-xl" : "rounded-xl"
    )}>
      {/* User Info */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="flex items-center gap-2 flex-1 min-w-0 p-1 rounded-lg hover:bg-discord-hover group"
          >
            <div className="relative">
              <Avatar className="w-8 h-8">
                <AvatarImage src={avatarUrl ?? undefined} className='object-cover'/>
                <AvatarFallback className="bg-discord-blurple text-white text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Status Indicator */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-discord-green rounded-full border-2 border-discord-darker group-hover:border-discord-hover" />
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-sm font-medium text-discord-text-primary truncate">
                {user.name}
              </span>
              <span className="text-xs text-discord-text-muted truncate">
                {user.customStatus || 'Online'}
              </span>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          className="w-[min(92vw,360px)] border-none bg-transparent p-0 shadow-none"
        >
          <UserProfileCard
            user={user}
            avatarUrl={avatarUrl}
            onEditProfile={() => openModal('editProfile')}
          />
        </PopoverContent>
      </Popover>

      {/* Controls */}
      <div className="flex items-center">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded hover:bg-discord-hover text-discord-text-secondary hover:text-discord-text-primary">
                <Mic className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Mute</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded hover:bg-discord-hover text-discord-text-secondary hover:text-discord-text-primary">
                <Headphones className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Deafen</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded hover:bg-discord-hover text-discord-text-secondary hover:text-discord-text-primary">
                <Settings className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>User Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
