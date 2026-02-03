import { motion, AnimatePresence } from 'framer-motion'
import { AudioPlayer } from './audio-player'
import { UserPanel } from './user-panel'
import { useAudioPlayerStore } from '@/stores/audio-player-store'

export function PlayerPanel() {
  const isActive = useAudioPlayerStore((state) => state.isActive && state.playlist.length > 0)

  return (
    <div className="fixed bottom-4 left-4 z-50 w-sm flex flex-col">
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <AudioPlayer />
          </motion.div>
        )}
      </AnimatePresence>
      <UserPanel />
    </div>
  )
}
