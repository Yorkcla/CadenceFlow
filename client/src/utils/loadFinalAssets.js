// src/utils/loadFinalAssets.js
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore'
import { db } from './firebase'

// 현재 프로젝트의 finalAssets 로딩
export async function loadFinalAssets(userId, projectId) {
  if (!userId || !projectId) return []

  const finalAssetsRef = collection(db, 'users', userId, 'projects', projectId, 'finalAssets')
  const snapshot = await getDocs(finalAssetsRef)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

// 다른 프로젝트 타이틀로 finalAssets 불러오기
export async function loadFinalAssetsByTitle(userId, titleInput) {
  if (!userId || !titleInput) return { data: [] }

  const projectsRef = collection(db, 'users', userId, 'projects')
  const q = query(projectsRef, where('title', '==', titleInput))
  const snapshot = await getDocs(q)

  if (snapshot.empty) return { data: [] }

  const projectDoc = snapshot.docs[0]
  const projectId = projectDoc.id
  const projectTitle = projectDoc.data().title || 'Untitled'

  const finalAssets = await loadFinalAssets(userId, projectId)
  return { data: finalAssets, projectId, projectTitle }
}



  



