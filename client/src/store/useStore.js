import { create } from 'zustand'

const useStore = create((set) => ({
  userId: '',
  projectId: '',
  setUserId: (id) => set({ userId: id }),
  setProjectId: (id) => set({ projectId: id }),
}))

export default useStore

