import { create } from 'zustand'

const useStore = create((set) => ({
  
  userId: '',
  projectId: '',
  projectTitle: '',
  setUserId: (id) => set({ userId: id }),
  setProjectId: (id) => set({ projectId: id }),
  setProjectTitle: (title) => set({ projectTitle: title }),

  showProjectModal: false,
  setShowProjectModal: (value) => set({ showProjectModal: value }),

  phases: [],
  addPhase: (phase) =>
    set((state) => ({ phases: [...state.phases, phase] })),
  setPhases: (newPhases) => set({ phases: newPhases }),

  stepsByPhase: {},

  setSteps: (phaseId, steps) =>
    set((state) => ({
      stepsByPhase: {
        ...state.stepsByPhase,
        [phaseId]: steps,
      },
    })),

  addStep: (phaseId, step) =>
    set((state) => {
      const currentSteps = state.stepsByPhase[phaseId] || []
      return {
        stepsByPhase: {
          ...state.stepsByPhase,
          [phaseId]: [...currentSteps, step],
        },
      }
    }),

  updateStep: (phaseId, index, updatedStep) =>
    set((state) => {
      const currentSteps = state.stepsByPhase[phaseId] || []
      const updatedSteps = [...currentSteps]
      updatedSteps[index] = updatedStep
      return {
        stepsByPhase: {
          ...state.stepsByPhase,
          [phaseId]: updatedSteps,
        },
      }
    }),

  removeStep: (phaseId) =>
    set((state) => {
      const currentSteps = state.stepsByPhase[phaseId] || []
      return {
        stepsByPhase: {
          ...state.stepsByPhase,
          [phaseId]: currentSteps.slice(0, -1),
        },
      }
    }),
}))

export default useStore


