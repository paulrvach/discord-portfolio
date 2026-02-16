import { create } from 'zustand'

interface ChatState {
  draftByChannel: Record<string, string>
  initializedChannelId: string | null
  showJumpToLatest: boolean
  setDraft: (channelId: string, content: string) => void
  clearDraft: (channelId: string) => void
  setInitializedChannelId: (channelId: string | null) => void
  setShowJumpToLatest: (show: boolean) => void
}

export const useChatStore = create<ChatState>((set) => ({
  draftByChannel: {},
  initializedChannelId: null,
  showJumpToLatest: false,
  setDraft: (channelId, content) =>
    set((state) => ({
      draftByChannel: {
        ...state.draftByChannel,
        [channelId]: content,
      },
    })),
  clearDraft: (channelId) =>
    set((state) => {
      if (!(channelId in state.draftByChannel)) return state
      const next = { ...state.draftByChannel }
      delete next[channelId]
      return { draftByChannel: next }
    }),
  setInitializedChannelId: (channelId) => set({ initializedChannelId: channelId }),
  setShowJumpToLatest: (show) => set({ showJumpToLatest: show }),
}))
