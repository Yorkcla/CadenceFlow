import { collection, deleteDoc, getDocs, doc } from 'firebase/firestore'
import { db } from './firebase'

export const cleanRemovedPhases = async (userId, projectId, currentPhases) => {
  const currentPhaseIds = currentPhases.map(p => String(p.id))
  const phasesCollection = collection(db, 'users', userId, 'projects', projectId, 'phases')
  const snapshot = await getDocs(phasesCollection)

  const deletePromises = snapshot.docs
    .filter(docSnap => !currentPhaseIds.includes(docSnap.id))
    .map(docSnap => deleteDoc(docSnap.ref))

  await Promise.all(deletePromises)
}
