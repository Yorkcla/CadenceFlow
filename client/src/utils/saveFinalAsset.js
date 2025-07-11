// 저장 위치: src/utils/saveFinalAsset.js
import { doc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export async function saveFinalAsset(userId, projectId, data) {
  const ref = doc(db, 'users', userId, 'projects', projectId, 'finalAssets', `${data.type}-${data.id}`)
  await setDoc(ref, { ...data, timestamp: Date.now() }, { merge: true })
}
