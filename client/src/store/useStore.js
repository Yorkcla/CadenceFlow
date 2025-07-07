import { create } from 'zustand'

const useStore = create((set) => ({
  userId: '',
  projectId: '',
  setUserId: (id) => set({ userId: id }),
  setProjectId: (id) => set({ projectId: id }),

  phases: [],
  addPhase: (phase) =>
    set((state) => ({ phases: [...state.phases, phase] })),
  setPhases: (newPhases) => set({ phases: newPhases }),

  steps: [],
  setSteps: (newSteps) => set({ steps: newSteps }),
}))

export default useStore

