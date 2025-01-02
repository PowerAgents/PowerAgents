import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface EmailState {
  email: string
  setEmail: (email: string) => void
}

export const useEmailStore = create<EmailState>()(
  persist(
    (set) => ({
      email: '',
      setEmail: (email: string) => set({ email }),
    }),
    {
      name: 'email-storage',
    }
  )
)
