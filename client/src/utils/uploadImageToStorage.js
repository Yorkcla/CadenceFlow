import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const storage = getStorage()

// 📌 Phase 이미지 업로드
export const uploadPhaseImageToStorage = async (blob, userId, projectId, phaseId) => {
  try {
    const storageRef = ref(storage, `users/${userId}/projects/${projectId}/phases/${phaseId}.png`)
    await uploadBytes(storageRef, blob)
    return await getDownloadURL(storageRef)
  } catch (error) {
    console.error('Phase image upload failed:', error)
    return null
  }
}

// 📌 Step 이미지 업로드 (Phase 하위에 저장)
export const uploadStepImageToStorage = async (blob, userId, projectId, phaseId, stepId) => {
  try {
    const storageRef = ref(storage, `users/${userId}/projects/${projectId}/phases/${phaseId}/steps/${stepId}.png`)
    await uploadBytes(storageRef, blob)
    return await getDownloadURL(storageRef)
  } catch (error) {
    console.error('Step image upload failed:', error)
    return null
  }
}

