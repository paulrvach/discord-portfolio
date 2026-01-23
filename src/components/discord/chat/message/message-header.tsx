interface MessageHeaderProps {
  name: string
  isBotMessage: boolean
  timeLabel: string
}

export function MessageHeader({
  name,
  isBotMessage,
  timeLabel,
}: MessageHeaderProps) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-medium text-discord-text-primary hover:underline cursor-pointer">
        {name}
      </span>
      {isBotMessage && (
        <span className="bg-discord-blurple text-white text-[10px] rounded px-1.5 py-0.5">
          BOT
        </span>
      )}
      <span className="text-xs text-discord-text-muted">{timeLabel}</span>
    </div>
  )
}
