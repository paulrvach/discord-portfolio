import { Plus } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { useModalStore } from '../../../stores/modal-store'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip'

export function NavigationAction() {
  const openModal = useModalStore((state) => state.openModal)

  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => openModal('createServer')}
            className="group"
          >
            <div
              className={cn(
                'server-icon bg-discord-dark group-hover:bg-discord-green'
              )}
            >
              <Plus className="w-6 h-6 text-discord-green group-hover:text-white transition-colors" />
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-discord-darker border-none">
          <p className="font-semibold">Add a Server</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
