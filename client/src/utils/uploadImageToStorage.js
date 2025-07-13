import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const storage = getStorage()

/** 내부 헬퍼: Blob or base64 → Blob */
const ensureBlob = (data) => {
  if (data instanceof Blob) return data
  if (typeof data !== 'string') throw new Error('Invalid data')
  const [header, base64] = data.split(',')
  const mime = header.match(/data:(.*);base64/)[1] || 'image/png'
  const bin = atob(base64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

/* ▼ Phase 이미지 업로드 */
export const uploadPhaseImageToStorage = async (blobOrBase64, userId, projectId, phaseId) => {
  try {
    const blob = ensureBlob(blobOrBase64)
    const refPath = `users/${userId}/projects/${projectId}/phases/${phaseId}.png`
    const storageRef = ref(storage, refPath)
    await uploadBytes(storageRef, blob)
    return await getDownloadURL(storageRef)
  } catch (e) {
    console.error('Phase upload failed:', e)
    return null
  }
}

/* ▼ Step 이미지 업로드 */
export const uploadStepImageToStorage = async (blobOrBase64, userId, projectId, phaseId, stepId) => {
  try {
    const blob = ensureBlob(blobOrBase64)
    const refPath = `users/${userId}/projects/${projectId}/phases/${phaseId}/steps/${stepId}.png`
    const storageRef = ref(storage, refPath)
    await uploadBytes(storageRef, blob)
    return await getDownloadURL(storageRef)
  } catch (e) {
    console.error('Step upload failed:', e)
    return null
  }
}



