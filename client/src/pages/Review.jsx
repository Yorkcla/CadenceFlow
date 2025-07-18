import React, { useEffect, useState } from 'react'
import useStore from '../store/useStore'
import ReviewCard from '../components/ReviewCard'
import VideoPanel from '../components/VideoPanel'
import { loadFinalAssets, loadFinalAssetsByTitle } from '../utils/loadFinalAssets'
import toast from 'react-hot-toast'
import SquareButton from '../components/SquareButton'
import MiniSquareButton from '../components/MiniSquareButton'
import { createProjectZip } from '../utils/createProjectZip'
import { saveAs } from 'file-saver'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../utils/firebase'

function sortByPhaseThenStep(assets) {
  const phases = assets.filter(a => a.type === 'phase')
  const steps = assets.filter(a => a.type === 'step')

  const sorted = []
  phases
    .sort((a, b) => Number(a.id) - Number(b.id))
    .forEach(phase => {
      sorted.push(phase)
      const linkedSteps = steps
        .filter(step =>
          String(step.phaseId) === String(phase.id) ||
          step.phaseTitle === phase.title
        )
        .sort((a, b) => Number(a.id) - Number(b.id))
      sorted.push(...linkedSteps)
    })

  return sorted
}

export default function Review() {
  const { userId, projectId, projectTitle } = useStore()
  const [reviewGroups, setReviewGroups] = useState([])
  const [otherTitle, setOtherTitle] = useState('')
  const [openVideoAssetIds, setOpenVideoAssetIds] = useState({})

  const toggleVideoPanel = (assetId) => {                         
    setOpenVideoAssetIds(prev => ({                              
      ...prev, [assetId]: !prev[assetId]                          
    }))                                                           
  }                                                               

  useEffect(() => {
    const fetchInitial = async () => {
      const data = await loadFinalAssets(userId, projectId)
      const sorted = sortByPhaseThenStep(data)
      setReviewGroups([{ title: projectTitle, assets: sorted, projectId }])
    }
    fetchInitial()
  }, [userId, projectId, projectTitle])

  const handleLoadOtherProject = async () => {
    if (!otherTitle) return
    const { data, projectId: otherId, projectTitle: fetchedTitle } = await loadFinalAssetsByTitle(userId, otherTitle)

    if (!data || data.length === 0) {
      toast.error('No assets found for that project!')
      return
    }

    if (reviewGroups.some(group => group.title === fetchedTitle)) {
      toast('Already loaded!')
      return
    }

    const sorted = sortByPhaseThenStep(data)
    setReviewGroups(prev => [...prev, { title: fetchedTitle, assets: sorted, projectId: otherId }])
    setOtherTitle('')
  }

  const handleDownloadZip = async (targetProjectId) => {
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'projects', targetProjectId, 'finalAssets'))
      const assets = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      const zipBlob = await createProjectZip(targetProjectId, assets)
      saveAs(zipBlob, `project-${targetProjectId}.zip`)
    } catch (err) {
      console.error(err)
      alert('❗️ 다운로드 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto space-y-12">
      <div className="flex gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="Project title"
          value={otherTitle}
          onChange={(e) => setOtherTitle(e.target.value)}
          className="placeholder:text-xs border rounded px-3 py-1"
        />
        <MiniSquareButton onClick={handleLoadOtherProject} title="Upload Project">
          📂
        </MiniSquareButton>
      </div>

      {reviewGroups.length === 0 ? (
        <div className="text-gray-500">No saved assets to review.</div>
      ) : (
        reviewGroups.map((group, idx) => (
          <div key={idx}>
            <h2 className="text-xl font-bold mb-3">{group.title}</h2>

            <div className="overflow-x-auto">
              <div className="flex gap-6 min-w-fit items-start pb-4">
                {group.assets.map((asset, i) => (
                  <div key={`${group.title}-${i}`}>
                    <ReviewCard
                      asset={asset}
                      onOpenVideo={() => toggleVideoPanel(asset.id)}
                    />

                    {openVideoAssetIds[asset.id] && (               
                      <VideoPanel
                        asset={asset}
                        userId={userId}
                        projectId={group.projectId}
                      />
                    )}
                  </div>
                ))}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <SquareButton onClick={() => handleDownloadZip(group.projectId)} title="Download File">
                    💾
                  </SquareButton>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}














