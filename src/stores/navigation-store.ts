import { create } from 'zustand'
import type { Id } from '../../convex/_generated/dataModel'

interface NavigationState {
  activeServerId: Id<'servers'> | null
  activeChannelId: Id<'channels'> | null
  setActiveServer: (serverId: Id<'servers'> | null) => void
  setActiveChannel: (channelId: Id<'channels'> | null) => void
  setActive: (serverId: Id<'servers'> | null, channelId: Id<'channels'> | null) => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeServerId: null,
  activeChannelId: null,
  setActiveServer: (serverId) => set({ activeServerId: serverId }),
  setActiveChannel: (channelId) => set({ activeChannelId: channelId }),
  setActive: (serverId, channelId) => set({ activeServerId: serverId, activeChannelId: channelId }),
}))
