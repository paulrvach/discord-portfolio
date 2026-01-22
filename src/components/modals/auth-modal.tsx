import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { useModalStore } from '../../stores/modal-store'

export function AuthModal() {
  const { isOpen, closeModal } = useModalStore()

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="bg-discord-dark border-none text-discord-text-primary sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome Back!
          </DialogTitle>
          <DialogDescription className="text-discord-text-secondary text-center">
            Sign in to send messages and join the conversation.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button
            className="w-full bg-discord-blurple hover:bg-discord-blurple-hover text-white"
            onClick={() => {
              // TODO: Implement auth
              closeModal()
            }}
          >
            Continue with Discord
          </Button>
          <Button
            variant="outline"
            className="w-full bg-transparent border-discord-divider text-discord-text-primary hover:bg-discord-hover"
            onClick={() => {
              // TODO: Implement guest mode
              closeModal()
            }}
          >
            Continue as Guest
          </Button>
        </div>
        <p className="text-xs text-discord-text-muted text-center mt-4">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </DialogContent>
    </Dialog>
  )
}
