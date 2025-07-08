import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const storage = getStorage()

export const uploadImageToStorage = async (blob, userId, projectId, phaseId) => {
  try {
    const storageRef = ref(storage, `users/${userId}/projects/${projectId}/phases/${phaseId}.png`)
    await uploadBytes(storageRef, blob)

    // 캐싱 방지를 위해 항상 새로 URL을 받아오고, 토큰 포함된 실제 URL 반환
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  } catch (error) {
    console.error('Image upload failed:', error)
    return null
  }
}

