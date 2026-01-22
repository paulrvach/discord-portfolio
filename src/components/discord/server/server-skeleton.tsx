import { Skeleton } from '../../ui/skeleton'

export function ServerSidebarSkeleton() {
  return (
    <div className="w-60 bg-discord-dark flex flex-col h-full">
      {/* Header */}
      <div className="h-12 px-4 flex items-center border-b border-discord-divider">
        <Skeleton className="w-40 h-5 rounded bg-discord-hover" />
      </div>

      {/* Channels */}
      <div className="flex-1 px-2 py-3 space-y-4">
        {/* Category 1 */}
        <div>
          <Skeleton className="w-24 h-3 mb-2 rounded bg-discord-hover" />
          <div className="space-y-0.5">
            <ChannelSkeleton />
            <ChannelSkeleton />
          </div>
        </div>

        {/* Category 2 */}
        <div>
          <Skeleton className="w-28 h-3 mb-2 rounded bg-discord-hover" />
          <div className="space-y-0.5">
            <ChannelSkeleton />
            <ChannelSkeleton />
            <ChannelSkeleton />
          </div>
        </div>
      </div>

      {/* User Panel */}
      <div className="h-[52px] px-2 bg-discord-darker/50 flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-full bg-discord-hover" />
        <div className="flex-1 space-y-1">
          <Skeleton className="w-20 h-4 rounded bg-discord-hover" />
          <Skeleton className="w-16 h-3 rounded bg-discord-hover" />
        </div>
      </div>
    </div>
  )
}

function ChannelSkeleton() {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 mx-2">
      <Skeleton className="w-5 h-5 rounded bg-discord-hover" />
      <Skeleton className="w-20 h-4 rounded bg-discord-hover" />
    </div>
  )
}

export function MemberSidebarSkeleton() {
  return (
    <aside className="w-60 bg-discord-dark flex flex-col h-full">
      <div className="p-3 space-y-4">
        {/* Role Group 1 */}
        <div>
          <Skeleton className="w-20 h-3 mb-2 px-2 rounded bg-discord-hover" />
          <div className="space-y-0.5">
            <MemberSkeleton />
            <MemberSkeleton />
          </div>
        </div>

        {/* Role Group 2 */}
        <div>
          <Skeleton className="w-24 h-3 mb-2 px-2 rounded bg-discord-hover" />
          <div className="space-y-0.5">
            <MemberSkeleton />
            <MemberSkeleton />
            <MemberSkeleton />
          </div>
        </div>
      </div>
    </aside>
  )
}

function MemberSkeleton() {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <Skeleton className="w-8 h-8 rounded-full bg-discord-hover" />
      <Skeleton className="w-20 h-4 rounded bg-discord-hover" />
    </div>
  )
}
