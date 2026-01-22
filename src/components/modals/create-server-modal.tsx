import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useModalStore } from '../../stores/modal-store'
import { useState } from 'react'

export function CreateServerModal() {
  const { isOpen, closeModal } = useModalStore()
  const [serverName, setServerName] = useState('')

  const handleCreate = () => {
    // TODO: Implement server creation
    closeModal()
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="bg-discord-dark border-none text-discord-text-primary sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Create Your Server
          </DialogTitle>
          <DialogDescription className="text-discord-text-secondary text-center">
            Your server is where you and your friends hang out. Make yours and start talking.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-discord-text-secondary">
              Server Name
            </Label>
            <Input
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              placeholder="My Awesome Server"
              className="bg-discord-dark border-none text-discord-text-primary placeholder:text-discord-text-muted focus-visible:ring-discord-blurple"
            />
          </div>
          <Button
            className="w-full bg-discord-blurple hover:bg-discord-blurple-hover text-white"
            onClick={handleCreate}
            disabled={!serverName.trim()}
          >
            Create Server
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
