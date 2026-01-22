import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Id } from '../../convex/_generated/dataModel'

interface UIState {
  // Member list visibility (per server)
  memberListVisible: boolean
  toggleMemberList: () => void
  setMemberListVisible: (visible: boolean) => void

  // Collapsed categories (per server)
  collapsedCategories: Record<string, boolean>
  toggleCategory: (categoryId: Id<'categories'>) => void
  setCategoryCollapsed: (categoryId: Id<'categories'>, collapsed: boolean) => void

  // User panel collapsed state
  userPanelCollapsed: boolean
  toggleUserPanel: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Member list
      memberListVisible: true,
      toggleMemberList: () => set((state) => ({ memberListVisible: !state.memberListVisible })),
      setMemberListVisible: (visible) => set({ memberListVisible: visible }),

      // Collapsed categories
      collapsedCategories: {},
      toggleCategory: (categoryId) =>
        set((state) => ({
          collapsedCategories: {
            ...state.collapsedCategories,
            [categoryId]: !state.collapsedCategories[categoryId],
          },
        })),
      setCategoryCollapsed: (categoryId, collapsed) =>
        set((state) => ({
          collapsedCategories: {
            ...state.collapsedCategories,
            [categoryId]: collapsed,
          },
        })),

      // User panel
      userPanelCollapsed: false,
      toggleUserPanel: () => set((state) => ({ userPanelCollapsed: !state.userPanelCollapsed })),
    }),
    {
      name: 'discord-ui-storage',
      partialize: (state) => ({
        memberListVisible: state.memberListVisible,
        collapsedCategories: state.collapsedCategories,
      }),
    }
  )
)
