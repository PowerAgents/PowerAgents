import { create } from 'zustand'

interface OnchainState {
  email: string
  isOnchainMode: boolean
  setEmail: (email: string) => void
  setIsOnchainMode: (isOnchainMode: boolean) => void
}

export const useOnchainStore = create<OnchainState>((set) => ({
  email: '',
  isOnchainMode: false,
  setEmail: (email) => set({ email }),
  setIsOnchainMode: (isOnchainMode) => set({ isOnchainMode }),
}))

