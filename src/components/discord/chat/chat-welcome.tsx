import { Hash } from 'lucide-react'

interface ChatWelcomeProps {
  channelName: string
}

export function ChatWelcome({ channelName }: ChatWelcomeProps) {
  return (
    <div className="pt-8 pb-4">
      <div className="w-[68px] h-[68px] rounded-full bg-discord-hover flex items-center justify-center mb-4">
        <Hash className="w-10 h-10 text-discord-text-primary" />
      </div>
      <h2 className="text-3xl font-bold text-discord-text-primary mb-2">
        Welcome to #{channelName}!
      </h2>
      <p className="text-discord-text-muted">
        This is the start of the #{channelName} channel.
      </p>
    </div>
  )
}
