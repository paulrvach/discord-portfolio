import { createFileRoute, Outlet, useParams } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { ServerSidebar } from '../../../components/discord/server/server-sidebar'
import { MemberSidebar } from '../../../components/discord/members/member-sidebar'
import { UserPanel } from '../../../components/discord/server/user-panel'
import { AudioPlayer } from '../../../components/discord/server/audio-player'
import { useUIStore } from '../../../stores/ui-store'
import type { Id } from '../../../../convex/_generated/dataModel'

export const Route = createFileRoute('/channels/$serverId')({
  component: ServerLayout,
})

function ServerLayout() {
  const { serverId } = useParams({ strict: false })
  const memberListVisible = useUIStore((state) => state.memberListVisible)
  
  // Fetch server data
  const server = useQuery(api.servers.get, { 
    serverId: serverId as Id<'servers'> 
  })

  if (!server) {
    return (
      <div className="flex-1 flex items-center justify-center bg-discord-chat">
        <div className="text-discord-text-muted">Loading server...</div>
      </div>
    )
  }

  return (
    <>
      {/* Server Sidebar - 240px */}
      <ServerSidebar server={server} />
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-row w-full bg-discord-chat overflow-hidden h-[98vh]">

        <Outlet />
      </div>
      
      {/* Member Sidebar - 240px (toggleable) */}
      {memberListVisible && (
        <MemberSidebar serverId={serverId as Id<'servers'>} />
      )}

      <div className="fixed bottom-4 left-4 z-50 w-72 flex flex-col gap-2">
        <AudioPlayer />
        <UserPanel />
      </div>
    </>
  )
}
