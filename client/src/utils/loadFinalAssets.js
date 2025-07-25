import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from './firebase'

function groupAndSortAssets(rawData) {
  rawData.sort((a, b) => {
    if (a.type === b.type) {
      return Number(a.id) - Number(b.id)
    }
    return a.type === 'phase' ? -1 : 1
  })

  const phaseMap = {}
  const orphanSteps = []

  rawData.forEach(item => {
    if (item.type === 'phase') {
      phaseMap[item.id] = { ...item, steps: [] }
    }
  })

  rawData.forEach(item => {
    if (item.type === 'step') {
      if (item.phaseId && phaseMap[item.phaseId]) {
        phaseMap[item.phaseId].steps.push(item)
      } else {
        orphanSteps.push(item)
      }
    }
  })

  const grouped = Object.values(phaseMap).flatMap(phase => [
    { ...phase, type: 'phase' },
    ...phase.steps.map(step => ({ ...step, type: 'step' }))
  ])

  const sortedOrphanSteps = orphanSteps.sort((a, b) =>
    Number(a.phaseId ?? 0) - Number(b.phaseId ?? 0)
  )

  return [...grouped, ...sortedOrphanSteps]
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




  



