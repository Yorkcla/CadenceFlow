import { doc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

/**
 * 
 * @param {string} userId 
 * @param {string} projectId 
 * @param {string} phaseId 
 * @param {string} [stepId] - optional
 * @param {object} config - sound config object
 * @param {string} soundUrl - Firebase Storage URL
 */
export async function saveSoundConfig(userId, projectId, phaseId, stepId, config, soundUrl) {
  const dataToSave = {
    ...config,
    soundUrl,
    timestamp: Date.now(),
  }

  const ref = stepId
    ? doc(db, 'users', userId, 'projects', projectId, 'phases', String(phaseId), 'steps', String(stepId))
    : doc(db, 'users', userId, 'projects', projectId, 'phases', String(phaseId))

  await setDoc(ref, { soundConfig: dataToSave }, { merge: true })
}
