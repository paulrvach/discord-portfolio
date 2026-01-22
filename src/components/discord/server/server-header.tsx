import { ChevronDown, Settings, UserPlus, FolderPlus, PlusCircle, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'
import { useModalStore } from '../../../stores/modal-store'
import type { Doc } from '../../../../convex/_generated/dataModel'

interface ServerHeaderProps {
  server: Doc<'servers'>
}

export function ServerHeader({ server }: ServerHeaderProps) {
  const openModal = useModalStore((state) => state.openModal)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full h-12 px-4 flex items-center justify-between text-discord-text-primary font-semibold border-b border-discord-divider hover:bg-discord-hover transition-colors">
          <span className="truncate">{server.name}</span>
          <ChevronDown className="w-4 h-4 ml-auto flex-shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-discord-darker border-none text-discord-text-secondary">
        <DropdownMenuItem
          onClick={() => openModal('inviteMembers', { serverId: server._id })}
          className="text-discord-blurple focus:bg-discord-blurple focus:text-white cursor-pointer"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite People
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-discord-divider" />
        <DropdownMenuItem
          onClick={() => openModal('serverSettings', { serverId: server._id })}
          className="focus:bg-discord-hover cursor-pointer"
        >
          <Settings className="w-4 h-4 mr-2" />
          Server Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => openModal('createChannel', { serverId: server._id })}
          className="focus:bg-discord-hover cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Channel
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-discord-hover cursor-pointer">
          <FolderPlus className="w-4 h-4 mr-2" />
          Create Category
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-discord-divider" />
        <DropdownMenuItem className="text-discord-red focus:bg-discord-red focus:text-white cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          Leave Server
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
