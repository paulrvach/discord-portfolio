import { ChevronDown, Plus } from 'lucide-react'
import { useParams } from '@tanstack/react-router'
import { cn } from '../../../lib/utils'
import { useUIStore } from '../../../stores/ui-store'
import { ServerChannel } from './server-channel'
import type { Doc, Id } from '../../../../convex/_generated/dataModel'

interface ServerChannelListProps {
  serverId: Id<'servers'>
  categories: Doc<'categories'>[]
  channels: Doc<'channels'>[]
}

export function ServerChannelList({ 
  serverId, 
  categories, 
  channels 
}: ServerChannelListProps) {
  const { collapsedCategories, toggleCategory } = useUIStore()
  const params = useParams({ strict: false })
  const activeChannelId = params.channelId

  // Group channels by category
  const channelsByCategory = channels.reduce((acc, channel) => {
    const categoryId = channel.categoryId ?? 'uncategorized'
    if (!acc[categoryId]) {
      acc[categoryId] = []
    }
    acc[categoryId].push(channel)
    return acc
  }, {} as Record<string, Doc<'channels'>[]>)

  // Sort categories by order
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)

  // Uncategorized channels
  const uncategorizedChannels = channelsByCategory['uncategorized'] ?? []

  return (
    <div className="py-3 space-y-4">
      {/* Uncategorized channels first */}
      {uncategorizedChannels.length > 0 && (
        <div className="space-y-0.5">
          {uncategorizedChannels.map((channel) => (
            <ServerChannel
              key={channel._id}
              channel={channel}
              serverId={serverId}
              isActive={activeChannelId === channel._id}
            />
          ))}
        </div>
      )}

      {/* Categorized channels */}
      {sortedCategories.map((category) => {
        const categoryChannels = channelsByCategory[category._id] ?? []
        const isCollapsed = collapsedCategories[category._id]

        return (
          <div key={category._id}>
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category._id)}
              className="flex items-center gap-0.5 w-full px-0.5 py-1 group"
            >
              <ChevronDown
                className={cn(
                  'w-3 h-3 text-discord-text-muted transition-transform',
                  isCollapsed && '-rotate-90'
                )}
              />
              <span className="text-xs font-semibold uppercase text-discord-text-muted tracking-wide group-hover:text-discord-text-secondary">
                {category.name}
              </span>
              <Plus className="w-4 h-4 ml-auto text-discord-text-muted opacity-0 group-hover:opacity-100" />
            </button>

            {/* Category Channels */}
            {!isCollapsed && (
              <div className="space-y-0.5 mt-1">
                {categoryChannels.map((channel) => (
                  <ServerChannel
                    key={channel._id}
                    channel={channel}
                    serverId={serverId}
                    isActive={activeChannelId === channel._id}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
