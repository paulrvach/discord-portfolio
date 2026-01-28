import { Hash } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface SidebarNavigationProps {
  sections: { label: string; active: boolean }[]
}

export function SidebarNavigation({ sections }: SidebarNavigationProps) {
  return (
    <aside className="w-64 bg-discord-dark flex flex-col border-r border-discord-divider">
      <div className="px-3 py-4">
        <div className="text-xs uppercase tracking-wide text-discord-text-muted">
          Portfolio
        </div>
        <div className="mt-2 flex flex-col gap-1">
          {sections.map((section) => (
            <div
              key={section.label}
              className={cn('channel-item', section.active && 'active')}
            >
              <Hash className="w-4 h-4 text-discord-channel-icon" />
              <span className="text-sm">#{section.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto px-4 py-4 text-xs text-discord-text-muted">
        Last updated Jan 2026
      </div>
    </aside>
  )
}
