import { MoreHorizontal, Smile, Reply, Pencil, Trash } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../ui/tooltip'

export function MessageActions() {
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
