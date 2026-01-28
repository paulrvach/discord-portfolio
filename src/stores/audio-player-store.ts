import { create } from 'zustand'

export type AudioTrack = {
  id: string
  title: string
  artist: string
  duration: number
  cover?: string
  url?: string
}

interface AudioPlayerState {
  isActive: boolean
  playlist: AudioTrack[]
  currentIndex: number
  isPlaying: boolean
  progress: number
  volume: number
  isMuted: boolean
  isRepeat: boolean
  isShuffle: boolean
  showPlaylist: boolean
  playTrack: (track: AudioTrack, playlist?: AudioTrack[]) => void
  togglePlay: () => void
  next: () => void
  prev: () => void
  setProgress: (progress: number) => void
  setVolume: (volume: number) => void
  setMuted: (isMuted: boolean) => void
  toggleMute: () => void
  toggleRepeat: () => void
  toggleShuffle: () => void
  togglePlaylist: () => void
  hangup: () => void
}

const defaultState = {
  isActive: false,
  playlist: [] as AudioTrack[],
  currentIndex: 0,
  isPlaying: false,
  progress: 0,
  volume: 75,
  isMuted: false,
  isRepeat: false,
  isShuffle: false,
  showPlaylist: true,
}

export const useAudioPlayerStore = create<AudioPlayerState>((set, get) => ({
  ...defaultState,
  playTrack: (track, playlist) => {
    const nextPlaylist = playlist?.length ? playlist : [track]
    const nextIndex = Math.max(
      0,
      nextPlaylist.findIndex((item) => item.id === track.id)
    )
    set({
      isActive: true,
      playlist: nextPlaylist,
      currentIndex: nextIndex,
      isPlaying: true,
      progress: 0,
    })
  },
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  next: () => {
    const { playlist, currentIndex, isShuffle, isRepeat } = get()
    if (!playlist.length) return
    if (isRepeat) {
      set({ progress: 0 })
      return
    }
    if (isShuffle && playlist.length > 1) {
      let newIndex = Math.floor(Math.random() * playlist.length)
      while (newIndex === currentIndex) {
        newIndex = Math.floor(Math.random() * playlist.length)
      }
      set({ currentIndex: newIndex, progress: 0 })
      return
    }
    const nextIndex = currentIndex === playlist.length - 1 ? 0 : currentIndex + 1
    set({ currentIndex: nextIndex, progress: 0 })
  },
  prev: () => {
    const { playlist, currentIndex } = get()
    if (!playlist.length) return
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1
    set({ currentIndex: prevIndex, progress: 0 })
  },
  setProgress: (progress) =>
    set((state) => (state.progress === progress ? state : { progress })),
  setVolume: (volume) =>
    set((state) => (state.volume === volume ? state : { volume })),
  setMuted: (isMuted) =>
    set((state) => (state.isMuted === isMuted ? state : { isMuted })),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleRepeat: () => set((state) => ({ isRepeat: !state.isRepeat })),
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  togglePlaylist: () => set((state) => ({ showPlaylist: !state.showPlaylist })),
  hangup: () => set({ ...defaultState }),
}))
