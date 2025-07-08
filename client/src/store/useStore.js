import { create } from 'zustand'

const useStore = create((set) => ({
  // 사용자/프로젝트 정보
  userId: '',
  projectId: '',
  setUserId: (id) => set({ userId: id }),
  setProjectId: (id) => set({ projectId: id }),

  // Phase 관련 상태
  phases: [],
  addPhase: (phase) =>
    set((state) => ({ phases: [...state.phases, phase] })),
  setPhases: (newPhases) => set({ phases: newPhases }),

  // Steps를 Phase별로 관리
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

