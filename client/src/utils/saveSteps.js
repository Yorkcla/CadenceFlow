import { db } from './firebase'
import { doc, setDoc } from 'firebase/firestore'

export const saveStepsToFirestore = async (userId, projectId, phaseId, steps) => {
  if (!userId || !projectId || !phaseId) {
    console.error('Missing ID(s) for saving steps')
    return
  }

  try {
    const ref = doc(db, 'users', userId, 'projects', projectId, 'phases', phaseId)
    await setDoc(ref, { steps: steps }, { merge: true })
    console.log('Steps saved successfully')
  } catch (error) {
    console.error('Error saving steps to Firestore:', error)
  }
}
