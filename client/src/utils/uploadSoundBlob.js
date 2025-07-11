import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { app } from './firebase' // ⚠️ 기존 firebase 설정에서 app 불러오기

const storage = getStorage(app)

/**
 * 
 * @param {*} userId 
 * @param {*} projectId 
 * @param {*} phaseId 
 * @param {*} stepId (optional)
 * @param {*} blob - WAV 파일 Blob
 * @returns {Promise<string>} - 다운로드 URL
 */
export async function uploadSoundBlob(userId, projectId, phaseId, stepId, blob) {
  const path = stepId
    ? `users/${userId}/projects/${projectId}/phases/${phaseId}/steps/${stepId}/sound.wav`
    : `users/${userId}/projects/${projectId}/phases/${phaseId}/sound.wav`

  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, blob)
  const downloadUrl = await getDownloadURL(storageRef)
  return downloadUrl
}
