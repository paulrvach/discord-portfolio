import { motion } from 'framer-motion'
import { cn } from '../../../lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip'
import { ProfileBadge } from './types'

interface ProfileBadgesProps {
  badges: ProfileBadge[]
}

export function ProfileBadges({ badges }: ProfileBadgesProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap pb-2">
      {badges.map((badge) => {
        const Icon = badge.icon
        const content = (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'size-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors',
              badge.bgClass
            )}
          >
            <Icon className={cn('w-5 h-5', badge.colorClass)} />
          </motion.div>
        )

        return (
          <Tooltip key={badge.id}>
            <TooltipTrigger asChild>
              {badge.href ? (
                <a href={badge.href} target="_blank" rel="noreferrer">
                  {content}
                </a>
              ) : (
                <div>{content}</div>
              )}
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-discord-darker border-none p-3 min-w-[140px]"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs text-discord-text-muted uppercase tracking-wider">
                  {badge.label}
                </span>
                <span className="font-semibold text-discord-text-primary">
                  {badge.value}
                </span>
                {badge.sublabel && (
                  <span className="text-xs text-discord-text-secondary">
                    {badge.sublabel}
                  </span>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
