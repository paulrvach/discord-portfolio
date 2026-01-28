import { useEffect, useMemo, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  ListMusic,
  ChevronUp,
  ChevronDown,
  PhoneOff,
} from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { useAudioPlayerStore } from '@/stores/audio-player-store'

export function AudioPlayer() {
  const {
    isActive,
    playlist,
    currentIndex,
    isPlaying,
    progress,
    volume,
    isMuted,
    isRepeat,
    isShuffle,
    showPlaylist,
    togglePlay,
    next,
    prev,
    setProgress,
    setVolume,
    setMuted,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    togglePlaylist,
    hangup,
    playTrack,
  } = useAudioPlayerStore(useShallow((state) => ({
    isActive: state.isActive,
    playlist: state.playlist,
    currentIndex: state.currentIndex,
    isPlaying: state.isPlaying,
    progress: state.progress,
    volume: state.volume,
    isMuted: state.isMuted,
    isRepeat: state.isRepeat,
    isShuffle: state.isShuffle,
    showPlaylist: state.showPlaylist,
    togglePlay: state.togglePlay,
    next: state.next,
    prev: state.prev,
    setProgress: state.setProgress,
    setVolume: state.setVolume,
    setMuted: state.setMuted,
    toggleMute: state.toggleMute,
    toggleRepeat: state.toggleRepeat,
    toggleShuffle: state.toggleShuffle,
    togglePlaylist: state.togglePlaylist,
    hangup: state.hangup,
    playTrack: state.playTrack,
  })))
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const track = playlist[currentIndex]
  
  // Console log the current track link
  useEffect(() => {
    if (track?.url) {
      console.log('Current track playing:', track.url)
    }
  }, [track?.url])

  // All hooks must be called before any early returns
  const coverLabel = useMemo(
    () => (track ? `${track.title} cover` : ''),
    [track?.title]
  )

  // Sync audio element with play/pause state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track?.url) return

    if (isPlaying) {
      audio.play().catch(() => {
        // Autoplay may be blocked, user interaction required
      })
    } else {
      audio.pause()
    }
  }, [isPlaying, track?.url])

  // Sync volume and mute
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = isMuted ? 0 : volume / 100
  }, [volume, isMuted])

  // Update progress from audio timeupdate
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track?.url) return

    const handleTimeUpdate = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        const newProgress = (audio.currentTime / audio.duration) * 100
        setProgress(newProgress)
      }
    }

    const handleEnded = () => {
      next()
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [track?.url, next, setProgress])

  // Load new track when it changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track?.url) return

    audio.src = track.url
    audio.load()
    if (isPlaying) {
      audio.play().catch(() => {})
    }
  }, [track?.url, track?.id])

  // Early return AFTER all hooks
  if (!isActive || !track) return null

  const currentTime = (progress / 100) * track.duration
  const isMutedOrZero = isMuted || volume === 0

  // Handle seeking when user drags the progress slider
  const handleSeek = (value: number[]) => {
    const nextValue = value[0]
    if (nextValue !== progress) {
      setProgress(nextValue)
      const audio = audioRef.current
      if (audio && audio.duration && Number.isFinite(audio.duration)) {
        audio.currentTime = (nextValue / 100) * audio.duration
      }
    }
  }

  return (
    <div className="w-full">
      {/* Hidden audio element for actual playback */}
      <audio ref={audioRef} preload="metadata" src={track.url}/>
      
      <div className="bg-card rounded-t-xl border border-border overflow-hidden shadow">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="relative">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {track.cover ? (
                <img
                  src={track.cover}
                  alt={coverLabel}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <ListMusic className="w-6 h-6 text-primary" />
                </div>
              )}
            </div>
            {isPlaying && (
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-card animate-pulse" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary truncate">Now Playing</p>
            <p className="text-xs text-muted-foreground truncate">
              {track.title} / {track.artist}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={togglePlaylist}
          >
            {showPlaylist ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
        </div>

        <div className="px-4 py-3">
          <Slider
            value={[progress]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(track.duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 px-4 pb-3">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'text-muted-foreground hover:text-foreground transition-colors',
              isShuffle && 'text-primary hover:text-primary'
            )}
            onClick={toggleShuffle}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={prev}
          >
            <SkipBack className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={next}
          >
            <SkipForward className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'text-muted-foreground hover:text-foreground transition-colors',
              isRepeat && 'text-primary hover:text-primary'
            )}
            onClick={toggleRepeat}
          >
            <Repeat className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3 px-4 pb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground shrink-0"
            onClick={toggleMute}
          >
            {isMutedOrZero ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Slider
            value={[isMutedOrZero ? 0 : volume]}
            onValueChange={(value: number[]) => {
              const nextValue = value[0]
              if (nextValue !== volume) {
                setVolume(nextValue)
              }
              const nextMuted = nextValue === 0
              if (nextMuted !== isMuted) {
                setMuted(nextMuted)
              }
            }}
            max={100}
            step={1}
            className="cursor-pointer"
          />
          <span className="text-xs text-muted-foreground w-8 text-right">
            {isMutedOrZero ? 0 : volume}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="text-rose-400 hover:text-rose-300"
            onClick={hangup}
            title="Hang up"
          >
            <PhoneOff className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showPlaylist && playlist.length > 1 && (
        <div className="bg-secondary/50 rounded-b-xl border border-t-0 border-border overflow-hidden">
          <div className="p-3 border-b border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Playlist
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {playlist.map((item, index) => (
              <button
                key={item.id}
                onClick={() => playTrack(item, playlist)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left',
                  currentIndex === index && 'bg-muted/70'
                )}
              >
                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
                  {currentIndex === index && isPlaying ? (
                    <div className="flex items-end gap-0.5 h-4">
                      <span
                        className="w-1 bg-primary animate-pulse rounded-full"
                        style={{ height: '60%' }}
                      />
                      <span
                        className="w-1 bg-primary animate-pulse rounded-full"
                        style={{ height: '100%', animationDelay: '0.2s' }}
                      />
                      <span
                        className="w-1 bg-primary animate-pulse rounded-full"
                        style={{ height: '40%', animationDelay: '0.4s' }}
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm font-medium truncate',
                      currentIndex === index ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{item.artist}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatTime(item.duration)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
