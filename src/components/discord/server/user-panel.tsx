import { Mic, Headphones, Settings, Pencil, ArrowRightLeft, Copy, Pin, LocateIcon, PinIcon, MarsStroke, LocationEdit, MapPin } from 'lucide-react'
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
import { cn } from '../../../lib/utils'

export function UserPanel() {
  const openModal = useModalStore((state) => state.openModal)
  const isAudioPlayerActive = useAudioPlayerStore((state) => state.isActive && state.playlist.length > 0)

  // TODO: Get actual user from auth
  const user = {
    name: 'Paul V',
    username: 'paulrvach',
    status: 'online' as const,
    customStatus: 'Buildin cool stuff',
    location: 'Irvine, CA',
    bio: 'Another Day in Pizza Paradise 🍕 ...',
    imageUrl: undefined,
    memberSince: 'Dec 3, 2016',
    links: [
      { label: 'github', url: 'https://github.com/paulrvach' },
      { label: 'website', url: 'https://paulvachon.dev/' },
      { label: 'twitter', url: 'https://twitter.com/paulvdev' },
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
                <AvatarImage src={user.imageUrl} />
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
        <PopoverContent side="top" align="start" className="w-[340px] p-0 bg-discord-dark border shadow-xl overflow-hidden border-discord-divider rounded-2xl">
          {/* Banner */}
          <div className="h-[60px] bg-[#0047AB]" />

          <div className="px-4 pb-4 -mt-10 relative">
            {/* Avatar with Status */}
            <div className="relative inline-block">
              <Avatar className="w-[80px] h-[80px] border-[6px] border-discord-dark">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback className="bg-discord-blurple text-white text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-discord-green rounded-full border-[6px] border-discord-dark" />
            </div>

            {/* User Details */}
            <div className="mt-3 p-3 bg-discord-darker rounded-lg">
              <div className="font-semibold text-xl text-discord-text-primary">
                {user.name}
              </div>
              <div className="text-discord-text-secondary text-sm">
                {user.username}
              </div>

              <div className="mt-3 flex items-center gap-2 text-discord-text-primary text-sm">
                <MapPin className='w-4 h-4'/><span>{user.location} </span>
              </div>

              <div className="mt-3 text-sm text-discord-text-primary">
                {user.bio}
              </div>

              {/* Links */}
              <div className="mt-3 pl-2 border-l-2 border-discord-divider space-y-1">
                {user.links.map((link) => (
                  <div key={link.label} className="text-sm">
                    <span className="font-semibold text-discord-text-primary mr-2 capitalize">{link.label}:</span>
                    <a 
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00A8FC] hover:underline"
                    >
                      {link.url}
                    </a>
                  </div>
                ))}
              </div>

              {/* Member Since */}
              <div className="mt-4">
                <div className="text-xs font-bold text-discord-text-primary uppercase mb-1">
                  Member Since
                </div>
                <div className="text-sm text-discord-text-secondary">
                  {user.memberSince}
                </div>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="mt-2 space-y-0.5">
              <button
                onClick={() => openModal('editProfile')}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-discord-blurple text-discord-text-secondary hover:text-white group transition-colors text-sm"
              >
                <div className="flex items-center gap-2">
                  <Pencil className="w-4 h-4" />
                  <span>Edit Profile</span>
                </div>
              </button>

              <button className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-discord-blurple text-discord-text-secondary hover:text-white group transition-colors text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-discord-green rounded-full" />
                  </div>
                  <span>Online</span>
                </div>
                <span className="opacity-0 group-hover:opacity-100 text-xs">
                  <ArrowRightLeft className="w-3 h-3 rotate-90" />
                </span>
              </button>

              <div className="h-[1px] bg-discord-divider my-1 mx-2" />

              <button className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-discord-blurple text-discord-text-secondary hover:text-white group transition-colors text-sm">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Switch Accounts</span>
                </div>
                <span className="opacity-0 group-hover:opacity-100 text-xs">
                  <ArrowRightLeft className="w-3 h-3" />
                </span>
              </button>

              <div className="h-[1px] bg-discord-divider my-1 mx-2" />

              <button className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-discord-blurple text-discord-text-secondary hover:text-white group transition-colors text-sm">
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  <span>Copy User ID</span>
                </div>
              </button>
            </div>
          </div>
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
            <TooltipContent side="top" className="bg-discord-darker border-none">
              <p>Mute</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded hover:bg-discord-hover text-discord-text-secondary hover:text-discord-text-primary">
                <Headphones className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-discord-darker border-none">
              <p>Deafen</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded hover:bg-discord-hover text-discord-text-secondary hover:text-discord-text-primary">
                <Settings className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-discord-darker border-none">
              <p>User Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
