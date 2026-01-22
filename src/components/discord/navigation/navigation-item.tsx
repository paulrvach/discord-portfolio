import { Link, useParams } from '@tanstack/react-router'
import { cn } from '../../../lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip'
import type { Id } from '../../../../convex/_generated/dataModel'

interface NavigationItemProps {
  id: Id<'servers'>
  name: string
  imageUrl?: string
}

export function NavigationItem({ id, name, imageUrl }: NavigationItemProps) {
  const params = useParams({ strict: false })
  const isActive = params.serverId === id

  // Get initials from server name
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative group">
            {/* Notification Pill */}
            <div
              className={cn(
                'notification-pill h-0 group-hover:h-5',
                isActive && 'h-10'
              )}
            />
            
            <Link
              to="/channels/$serverId"
              params={{ serverId: id }}
            >
              <div
                className={cn(
                  'server-icon overflow-hidden',
                  isActive && 'rounded-2xl'
                )}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-discord-text-primary font-semibold text-sm">
                    {initials}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-discord-darker border-none">
          <p className="font-semibold">{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
