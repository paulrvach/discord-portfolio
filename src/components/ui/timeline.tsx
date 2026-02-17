import * as React from 'react'
import { cn } from '@/lib/utils'

export type TimelineStatus = 'completed' | 'in-progress' | 'pending'

type TimelineProps = React.ComponentProps<'ol'>

function Timeline({ className, ...props }: TimelineProps) {
  return (
    <ol
      data-slot="timeline"
      className={cn('flex items-start gap-1.5', className)}
      {...props}
    />
  )
}

type TimelineItemProps = {
  title: string
  status?: TimelineStatus
  isLast?: boolean
  className?: string
  onClick?: () => void
}

function TimelineItem({
  title,
  status = 'pending',
  isLast = false,
  className,
  onClick,
}: TimelineItemProps) {
  return (
    <li data-slot="timeline-item" className={cn('flex-1', className)}>
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left"
      >
        <div className="flex items-center">
          <span
            className={cn(
              'h-4 w-4 shrink-0 rounded-full border transition-colors',
              status === 'in-progress'
                ? 'border-sky-300 bg-sky-300'
                : status === 'completed'
                  ? 'border-sky-300/70 bg-sky-300/70'
                  : 'border-white/20 bg-white/10'
            )}
          />
          {!isLast ? (
            <span
              className={cn(
                'h-px flex-1 transition-colors',
                status === 'completed' ? 'bg-sky-300/70' : 'bg-white/15'
              )}
            />
          ) : null}
        </div>
        <p
          className={cn(
            'mt-2 text-sm leading-tight font-semibold transition-opacity',
            status === 'in-progress' ? 'text-discord-text-primary opacity-100' : 'text-discord-text-primary/60 opacity-70'
          )}
        >
          {title}
        </p>
      </button>
    </li>
  )
}

export { Timeline, TimelineItem }
