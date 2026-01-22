import { Skeleton } from '../../ui/skeleton'

export function ChatSkeleton() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header Skeleton */}
      <div className="h-12 px-4 flex items-center border-b border-discord-divider">
        <Skeleton className="w-6 h-6 rounded bg-discord-hover" />
        <Skeleton className="w-24 h-5 ml-2 rounded bg-discord-hover" />
      </div>

      {/* Messages Skeleton */}
      <div className="flex-1 px-4 py-4 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <MessageSkeleton key={i} isCompact={i % 3 !== 0} />
        ))}
      </div>

      {/* Input Skeleton */}
      <div className="px-4 pb-6">
        <Skeleton className="w-full h-11 rounded-lg bg-discord-hover" />
      </div>
    </div>
  )
}

function MessageSkeleton({ isCompact }: { isCompact: boolean }) {
  if (isCompact) {
    return (
      <div className="pl-14 py-0.5">
        <Skeleton className="w-3/4 h-4 rounded bg-discord-hover" />
      </div>
    )
  }

  return (
    <div className="flex gap-4 mt-4">
      <Skeleton className="w-10 h-10 rounded-full bg-discord-hover flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-24 h-4 rounded bg-discord-hover" />
          <Skeleton className="w-16 h-3 rounded bg-discord-hover" />
        </div>
        <Skeleton className="w-full h-4 rounded bg-discord-hover" />
        <Skeleton className="w-2/3 h-4 rounded bg-discord-hover" />
      </div>
    </div>
  )
}
