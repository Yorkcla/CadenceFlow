// 저장 위치: src/utils/saveFinalAsset.js
import { doc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export async function saveFinalAsset(userId, projectId, data) {
  const safeId = String(data.id).trim()         // 숫자 → 문자열 변환 + 공백 제거
  const safeType = String(data.type).trim()     // type도 혹시 몰라 안전 처리
  const docId = `${safeType}-${safeId}`         // 예: 'phase-1' 또는 'step-3'

  const ref = doc(db, 'users', userId, 'projects', projectId, 'finalAssets', docId)
  await setDoc(ref, { ...data, timestamp: Date.now() }, { merge: true }) // 🔁 덮어쓰기 허용
}
