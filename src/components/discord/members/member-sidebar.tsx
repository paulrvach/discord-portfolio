import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { ScrollArea } from '../../ui/scroll-area'
import { MemberItem } from './member-item'
import type { Doc, Id } from '../../../../convex/_generated/dataModel'

interface MemberSidebarProps {
  serverId: Id<'servers'>
}

// Role configuration for display
const ROLE_CONFIG = {
  owner: { label: 'Owner', color: '#f47fff' },
  admin: { label: 'Admin', color: '#e74c3c' },
  moderator: { label: 'Moderator', color: '#3498db' },
  member: { label: 'Member', color: undefined },
} as const

type MemberWithUser = Doc<'members'> & {
  user: {
    _id: Id<'users'>
    name: string
    imageUrl?: string
    status: 'online' | 'idle' | 'dnd' | 'offline'
    customStatus?: string
  }
}

export function MemberSidebar({ serverId }: MemberSidebarProps) {
  // Fetch members for this server
  const members = useQuery(api.servers.getMembers, { serverId })

  if (!members) {
    return (
      <div className="w-60 bg-discord-dark flex items-center justify-center">
        <div className="text-discord-text-muted text-sm">Loading...</div>
      </div>
    )
  }

  // Group members by status (online first, then offline)
  const onlineMembers = members.filter((m: MemberWithUser) => m.user.status !== 'offline')
  const offlineMembers = members.filter((m: MemberWithUser) => m.user.status === 'offline')

  // Further group online members by role
  const membersByRole = onlineMembers.reduce((acc: Record<string, MemberWithUser[]>, member: MemberWithUser) => {
    const role = member.role
    if (!acc[role]) {
      acc[role] = []
    }
    acc[role].push(member)
    return acc
  }, {} as Record<string, MemberWithUser[]>)

  // Sort roles by priority
  const roleOrder = ['owner', 'admin', 'moderator', 'member']
  const sortedRoles = roleOrder.filter((role) => membersByRole[role]?.length > 0)

  return (
    <aside className="w-60 bg-discord-dark flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Online Members by Role */}
          {sortedRoles.map((role) => {
            const roleMembers = membersByRole[role] ?? []
            const config = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG]

            return (
              <div key={role}>
                <h3 className="px-2 mb-1 text-xs font-semibold uppercase text-discord-text-muted tracking-wide">
                  {config.label} — {roleMembers.length}
                </h3>
                <div className="space-y-0.5">
                  {roleMembers.map((member: MemberWithUser) => (
                    <MemberItem
                      key={member._id}
                      member={member}
                      roleColor={member.roleColor || config.color}
                    />
                  ))}
                </div>
              </div>
            )
          })}

          {/* Offline Members */}
          {offlineMembers.length > 0 && (
            <div>
              <h3 className="px-2 mb-1 text-xs font-semibold uppercase text-discord-text-muted tracking-wide">
                Offline — {offlineMembers.length}
              </h3>
              <div className="space-y-0.5">
                {offlineMembers.map((member: MemberWithUser) => (
                  <MemberItem
                    key={member._id}
                    member={member}
                    roleColor={member.roleColor}
                    isOffline
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}
