// src/utils/loadFinalAssets.js

import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from './firebase'

// 🧩 정렬 + 그룹핑: phase 아래에 step 붙이기
function groupAndSortAssets(rawData) {
  // 정렬: type 먼저, 그 다음 id 오름차순
  rawData.sort((a, b) => {
    if (a.type === b.type) {
      return Number(a.id) - Number(b.id)
    }
    return a.type === 'phase' ? -1 : 1
  })

  const phaseMap = {}
  rawData.forEach(item => {
    if (item.type === 'phase') {
      phaseMap[item.id] = { ...item, steps: [] }
    }
  })

  rawData.forEach(item => {
    if (item.type === 'step' && item.phaseId && phaseMap[item.phaseId]) {
      phaseMap[item.phaseId].steps.push(item)
    }
  })

  const grouped = Object.values(phaseMap).flatMap(phase => [
    { ...phase, type: 'phase' },
    ...phase.steps.map(step => ({ ...step, type: 'step' }))
  ])

  return grouped
}

// 🔵 ID 기반 불러오기
export async function loadFinalAssets(userId, projectId) {
  if (!userId || !projectId) return []

  const finalAssetsRef = collection(db, 'users', userId, 'projects', projectId, 'finalAssets')
  const snapshot = await getDocs(finalAssetsRef)
  const rawData = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))

  return groupAndSortAssets(rawData)
}

// 🟢 Title 기반 불러오기
export async function loadFinalAssetsByTitle(userId, title) {
  if (!userId || !title) return []

  const projectQuery = query(collection(db, 'users', userId, 'projects'), where('title', '==', title))
  const projectSnapshot = await getDocs(projectQuery)

  if (projectSnapshot.empty) return { data: [], projectId: null, projectTitle: title }

  const projectDoc = projectSnapshot.docs[0]
  const projectId = projectDoc.id
  const projectTitle = projectDoc.data().title || title

  const finalAssetsRef = collection(db, 'users', userId, 'projects', projectId, 'finalAssets')
  const finalSnapshot = await getDocs(finalAssetsRef)

  const rawData = finalSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))

  return {
    data: groupAndSortAssets(rawData),
    projectId,
    projectTitle
  }
}




  



