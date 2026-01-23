interface MessageContentProps {
  content: string
  editedAt?: number
}

export function MessageContent({ content, editedAt }: MessageContentProps) {
  if (!content) return null

  return (
    <p className="text-discord-text-primary leading-relaxed">
      {content}
      {editedAt && (
        <span className="text-[10px] text-discord-text-muted ml-1">(edited)</span>
      )}
    </p>
  )
}
