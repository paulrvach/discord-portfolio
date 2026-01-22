import { create } from 'zustand'
import type { Id } from '../../convex/_generated/dataModel'

export type ModalType =
  | 'createServer'
  | 'editServer'
  | 'inviteMembers'
  | 'serverSettings'
  | 'createChannel'
  | 'deleteChannel'
  | 'deleteMessage'
  | 'editProfile'
  | 'auth'
  | null

interface ModalData {
  serverId?: Id<'servers'>
  channelId?: Id<'channels'>
  messageId?: Id<'messages'>
}

interface ModalState {
  type: ModalType
  data: ModalData
  isOpen: boolean
  openModal: (type: ModalType, data?: ModalData) => void
  closeModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  openModal: (type, data = {}) => set({ type, data, isOpen: true }),
  closeModal: () => set({ type: null, data: {}, isOpen: false }),
}))
