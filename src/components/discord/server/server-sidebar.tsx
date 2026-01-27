import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { ScrollArea } from '../../ui/scroll-area'
import { ServerHeader } from './server-header'
import { ServerChannelList } from './server-channel-list'
import type { Doc } from '../../../../convex/_generated/dataModel'

interface ServerSidebarProps {
  server: Doc<'servers'>
}

export function ServerSidebar({ server }: ServerSidebarProps) {
  // Fetch categories and channels for this server
  const categories = useQuery(api.categories.listByServer, { 
    serverId: server._id 
  })
  const channels = useQuery(api.channels.listByServer, { 
    serverId: server._id 
  })

  return (
    <div className="bg-discord-dark flex flex-col h-full border-r w-80">
      {/* Server Header with Dropdown */}
      <ServerHeader server={server} />
      
      {/* Channel List */}
      <ScrollArea className="flex-1 px-2">
        <ServerChannelList
          serverId={server._id}
          categories={categories ?? []}
          channels={channels ?? []}
        />
      </ScrollArea>
      
    </div>
  )
}
