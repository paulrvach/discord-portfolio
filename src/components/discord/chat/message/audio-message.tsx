import { useMemo } from 'react'
import { Headphones, Play, Radio } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAudioPlayerStore } from '../../../../stores/audio-player-store'
import type { AudioPayload } from './message-types'

interface AudioMessageProps {
  audio: AudioPayload
}

export function AudioMessage({ audio }: AudioMessageProps) {
  const playTrack = useAudioPlayerStore((state) => state.playTrack)
  const isActive = useAudioPlayerStore((state) => state.isActive)
  const currentTrack = useAudioPlayerStore((state) => state.playlist[state.currentIndex])
  const isCurrentTrack = isActive && currentTrack?.id === audio.id

  const durationLabel = useMemo(() => formatTime(audio.duration), [audio.duration])

  const handleClick = () => {
    console.log('Audio message clicked:', audio)
    console.log('Audio URL:', audio.url)
    playTrack(audio)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'mt-2 w-full max-w-md rounded-lg border border-discord-divider bg-discord-darker/40 p-3 text-left',
        'transition-colors hover:bg-discord-hover/50',
        isCurrentTrack && 'border-discord-blurple/70 bg-discord-hover/60'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-discord-hover">
          {isCurrentTrack ? (
            <Radio className="h-5 w-5 text-discord-blurple" />
          ) : (
            <Headphones className="h-5 w-5 text-discord-text-primary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-discord-text-primary truncate">
              {audio.title}
            </p>
            {isCurrentTrack && (
              <span className="text-[11px] rounded-full bg-discord-blurple/20 px-2 py-0.5 text-discord-blurple">
                Playing
              </span>
            )}
          </div>
          <p className="text-xs text-discord-text-secondary truncate">
            {audio.artist}
          </p>
        </div>

        <div className="flex items-center gap-2 text-discord-text-muted">
          <span className="text-xs">{durationLabel}</span>
          <Play className="h-4 w-4" />
        </div>
      </div>
    </button>
  )
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
