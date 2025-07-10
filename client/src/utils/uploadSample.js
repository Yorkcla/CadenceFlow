import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const uploadSample = async (userId, projectId, phaseId, stepId, file) => {
    const storage = getStorage()
    const path = stepId
      ? `users/${userId}/projects/${projectId}/phases/${phaseId}/steps/${stepId}/samples/${file.name}`
      : `users/${userId}/projects/${projectId}/phases/${phaseId}/samples/${file.name}`
    const fileRef = ref(storage, path)
  
    await uploadBytes(fileRef, file)
    const url = await getDownloadURL(fileRef)
    return url
  }
  
