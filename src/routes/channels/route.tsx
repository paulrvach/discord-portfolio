import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ServerRail } from '../../components/discord/navigation/server-rail'
import { Skeleton } from '../../components/ui/skeleton'
import { SidebarProvider, SidebarInset } from '../../components/ui/sidebar'

export const Route = createFileRoute('/channels')({
  component: ChannelsLayout,
  // Disable SSR for real-time Convex features
  ssr: false,
  pendingComponent: ChannelsLoading,
})

function ChannelsLoading() {
  return (
    <div className="h-screen flex overflow-hidden bg-discord-chat">
      {/* Server Rail Skeleton */}
      <div className="w-[72px] h-full bg-discord-darker flex flex-col items-center py-3 gap-2">
        <Skeleton className="w-12 h-12 rounded-full bg-discord-dark" />
        <div className="w-8 h-0.5 bg-discord-divider rounded-full my-2" />
        <Skeleton className="w-12 h-12 rounded-full bg-discord-dark" />
        <Skeleton className="w-12 h-12 rounded-full bg-discord-dark" />
      </div>

      {/* Sidebar Skeleton */}
      <div className="w-60 bg-discord-dark" />

      {/* Main Content Skeleton */}
      <div className="flex-1 bg-discord-chat" />
    </div>
  )
}

function ChannelsLayout() {
  return (
    <SidebarProvider
      defaultOpen={false}
      style={{
        '--sidebar-width': '72px',
        '--sidebar-width-icon': '72px',
      } as React.CSSProperties}
      className=''
    >
      {/* Server Rail - Fixed 72px width, always collapsed to icon */}
      <ServerRail />

      {/* Main Content Area */}
      <SidebarInset className="flex w-full h-screen overflow-hidden border-discord-divider border">
        <div className="flex flex-1 min-h-0 w-full">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
