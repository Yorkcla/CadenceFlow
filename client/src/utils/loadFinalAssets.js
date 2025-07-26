import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from './firebase'

function groupAndSortAssets(rawData) {
  const phaseMap = {}
  const stepMap = {}

  rawData.forEach(item => {
    if (item.type === 'phase') {
      phaseMap[item.id] = { ...item }
    } else if (item.type === 'step') {
      const phaseId = item.phaseId ?? '__orphan__'
      if (!stepMap[phaseId]) stepMap[phaseId] = []
      stepMap[phaseId].push(item)
    }
  })

  const allPhaseIds = new Set([
    ...Object.keys(phaseMap),
    ...Object.keys(stepMap).filter(id => id !== '__orphan__')
  ])

  const sortedPhaseIds = Array.from(allPhaseIds).sort((a, b) => Number(a) - Number(b))

  const result = []

  sortedPhaseIds.forEach(pid => {
    if (phaseMap[pid]) {
      result.push({ ...phaseMap[pid], type: 'phase' })
    }

    const steps = stepMap[pid] || []
    steps.sort((a, b) => Number(a.id) - Number(b.id))
    result.push(...steps.map(step => ({ ...step, type: 'step' })))
  })

  const orphanSteps = stepMap['__orphan__'] || []
  orphanSteps.sort((a, b) => Number(a.id) - Number(b.id))
  result.push(...orphanSteps.map(step => ({ ...step, type: 'step' })))

  return result
}

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




  



