import { useRef, useEffect } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Plus, Gift, Sticker, Smile } from 'lucide-react'
import { useChatStore } from '../../../stores/chat-store'
import type { Id } from '../../../../convex/_generated/dataModel'

interface ChatInputProps {
  channelId: Id<'channels'>
  channelName: string
}

export function ChatInput({ channelId, channelName }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const channelIdKey = String(channelId)
  const content = useChatStore((state) => state.draftByChannel[channelIdKey] ?? '')
  const setDraft = useChatStore((state) => state.setDraft)
  const clearDraft = useChatStore((state) => state.clearDraft)

  const sendMessage = useMutation(api.messages.send)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [content])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) return

    try {
      await sendMessage({
        channelId,
        content: content.trim(),
      })
      clearDraft(channelIdKey)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 pb-6">
      <div className="flex items-end gap-0 bg-card rounded-lg border  border-discord-divider">
        {/* Attachment Button */}
        <button
          type="button"
          className="p-3 text-discord-text-muted hover:text-discord-text-primart"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Input Area */}
        <div className="flex-1 py-2.5">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setDraft(channelIdKey, e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${channelName}`}
            className="w-full bg-transparent text-discord-text-primary placeholder:text-discord-text-muted resize-none max-h-[200px] focus:outline-none text-base leading-relaxed"
            rows={1}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 px-2 py-2">
          <button
            type="button"
            className="p-1.5 text-discord-text-muted hover:text-discord-text-secondary"
          >
            <Gift className="w-6 h-6" />
          </button>
          <button
            type="button"
            className="p-1.5 text-discord-text-muted hover:text-discord-text-secondary"
          >
            <Sticker className="w-6 h-6" />
          </button>
          <button
            type="button"
            className="p-1.5 text-discord-text-muted hover:text-discord-text-secondary"
          >
            <Smile className="w-6 h-6" />
          </button>
        </div>
      </div>
    </form>
  )
}
