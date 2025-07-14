// 저장 위치: src/utils/saveFinalAsset.js
import { doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from './firebase'

// 🎯 개별 저장 (merge 허용)
export async function saveFinalAsset(userId, projectId, data) {
  const safeId = String(data.id).trim()
  const safeType = String(data.type).trim()
  const docId = `${safeType}-${safeId}`

  console.log('💾 Saving Final Asset...')
  console.log('ID:', data.id)
  console.log('Type:', data.type)
  console.log('Phase ID:', data.phaseId)
  console.log('Step ID:', data.stepId)

  const ref = doc(db, 'users', userId, 'projects', projectId, 'finalAssets', docId)
  await setDoc(ref, { ...data, timestamp: Date.now() }, { merge: true })
}

// 🧹 전체 삭제 (초기화용)
export async function deleteAllFinalAssets(userId, projectId) {
  const colRef = collection(db, 'users', userId, 'projects', projectId, 'finalAssets')
  const snapshot = await getDocs(colRef)

  const deletions = snapshot.docs.map(docSnap =>
    deleteDoc(doc(db, 'users', userId, 'projects', projectId, 'finalAssets', docSnap.id))
  )

  await Promise.all(deletions)
}

export async function updateVideoUrlInFirestore(assetId, url) {
  const ref = doc(db, 'finalAssets', assetId);
  await updateDoc(ref, { videoDownloadUrl: url });
}

