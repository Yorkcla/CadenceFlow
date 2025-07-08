// src/utils/savePhases.js
import { db } from './firebase'
import { doc, setDoc } from 'firebase/firestore'

export const savePhasesToFirestore = async (userId, projectId, projectTitle, phases) => {
  if (!userId || !projectId) {
    console.error('userId or projectId is missing')
    return
  }

  try {
    const ref = doc(db, 'users', userId, 'projects', projectId)
    await setDoc(ref, {
      title: projectTitle,
      updatedAt: new Date().toISOString(),
      phases: phases,
    })

    console.log('Phases saved successfully!')
  } catch (error) {
    console.error('Error saving phases:', error)
  }
}

