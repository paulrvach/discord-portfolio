import { useModalStore } from '../../stores/modal-store'
import { AuthModal } from '../modals/auth-modal'
import { CreateServerModal } from '../modals/create-server-modal'

export function ModalProvider() {
  const { type, isOpen } = useModalStore()

  return (
    <>
      {type === 'auth' && isOpen && <AuthModal />}
      {type === 'createServer' && isOpen && <CreateServerModal />}
    </>
  )
}
