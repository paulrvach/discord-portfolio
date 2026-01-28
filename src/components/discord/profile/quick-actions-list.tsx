import { motion } from 'framer-motion'
import { FolderOpen, ArrowUpRight } from 'lucide-react'
import { QuickAction } from './types'

interface QuickActionsListProps {
  actions: QuickAction[]
}

export function QuickActionsList({ actions }: QuickActionsListProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-discord-text-primary">
        <FolderOpen className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Quick Actions</h2>
      </div>
      <div className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <motion.a
              key={action.title}
              href={action.href}
              target="_blank"
              rel="noreferrer"
              whileHover={{ x: 6 }}
              className="group flex items-center gap-3 rounded-lg border border-discord-divider bg-discord-dark px-3 py-2 text-discord-text-primary transition-colors hover:bg-discord-hover"
            >
              <div className="size-8 rounded-md bg-discord-channel flex items-center justify-center text-discord-text-secondary">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">@{action.title}</span>
                <span className="text-xs text-discord-text-muted">
                  {action.description}
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 ml-auto text-discord-text-muted group-hover:text-discord-text-primary transition-colors" />
            </motion.a>
          )
        })}
      </div>
    </div>
  )
}
