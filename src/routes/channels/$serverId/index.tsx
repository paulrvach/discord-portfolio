import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useEffect } from 'react'
import type { Id } from '../../../../convex/_generated/dataModel'

export const Route = createFileRoute('/channels/$serverId/')({
  component: ServerIndex,
})

function ServerIndex() {
  const { serverId } = useParams({ strict: false })
  const navigate = useNavigate()
  
  // Fetch channels to find the first text channel
  const channels = useQuery(api.channels.listByServer, { 
    serverId: serverId as Id<'servers'> 
  })

  useEffect(() => {
    if (channels && channels.length > 0) {
      // Find the first text channel
      const firstTextChannel = channels.find((c: { type: string }) => c.type === 'text')
      if (firstTextChannel) {
        navigate({
          to: '/channels/$serverId/$channelId',
          params: { serverId: serverId!, channelId: firstTextChannel._id },
          replace: true,
        })
      }
    }
  }, [channels, serverId, navigate])

  return (
    <div className="flex-1 flex items-center justify-center bg-discord-chat">
      <div className="text-discord-text-muted">Loading channels...</div>
    </div>
  )
}
