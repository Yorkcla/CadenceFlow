// src/utils/savePhases.js
import { db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'

export const savePhasesToFirestore = async (userId, projectId, phases) => {
  if (!userId || !projectId) {
    console.warn('⚠️ userId or projectId missing – cannot save.')
    return
  }

  try {
    await setDoc(doc(db, 'projects', `${userId}_${projectId}`), {
      phases,
      updatedAt: new Date().toISOString(),
    })
    console.log('✅ Phases saved to Firestore.')
  } catch (error) {
    console.error('❌ Error saving phases:', error)
  }
}
