import { useState } from 'react'
import { Users, Activity, Server } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { DeepAgentExperienceShowcase } from './deep-agent-experience'
import { StageDiveExperienceShowcase } from './stage-dive-experience'

type TabKey = 'activity' | 'friends' | 'servers'

export type MutualServer = {
  id: string
  name: string
  description?: string
}

interface ProfileTabsPanelProps {
  mutualServers: MutualServer[]
}

const tabs: Array<{ key: TabKey; label: string; icon: typeof Activity }> = [
  { key: 'activity', label: 'Activity', icon: Activity },
  { key: 'friends', label: 'No Mutual Friends', icon: Users },
  { key: 'servers', label: 'Mutual Servers', icon: Server },
]

export function ProfileTabsPanel({ mutualServers }: ProfileTabsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('servers')

  return (
    <section className="flex-1 bg-discord-dark rounded-xl border border-discord-divider overflow-hidden shadow-xl ">
      <div className="flex items-center gap-6 px-6 pt-5 border-b border-discord-divider">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 pb-3 text-sm font-medium transition-colors',
                isActive
                  ? 'text-discord-text-primary border-b-2 border-discord-text-primary'
                  : 'text-discord-text-muted hover:text-discord-text-primary'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="p-6">
        {activeTab === 'servers' && (
          <div className="space-y-3">
            {mutualServers.map((server) => (
              <div
                key={server.id}
                className="flex items-center gap-3 rounded-lg bg-discord-darker border border-discord-divider px-4 py-3"
              >
                <div className="h-10 w-10 rounded-full bg-discord-channel flex items-center justify-center text-discord-text-primary font-semibold">
                  {server.name.slice(0, 1)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-discord-text-primary">
                    {server.name}
                  </div>
                  {server.description && (
                    <div className="text-xs text-discord-text-muted">
                      {server.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            <DeepAgentExperienceShowcase />
            <StageDiveExperienceShowcase />
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="rounded-lg bg-discord-darker border border-discord-divider p-6 text-sm text-discord-text-muted">
            No mutual friends yet.
          </div>
        )}
      </div>
    </section>
  )
}
