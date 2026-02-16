import { create } from 'zustand'

interface IdentityState {
  avatarUrl: string | null
  setAvatarUrl: (url: string | null) => void
}

export const useIdentityStore = create<IdentityState>()((set) => ({
  avatarUrl: null,
  setAvatarUrl: (url) => set({ avatarUrl: url }),
}))
