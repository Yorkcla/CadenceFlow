import React, { useEffect, useState } from 'react'
import useStore from '../store/useStore'
import ReviewCard from '../components/ReviewCard'
import { loadFinalAssets, loadFinalAssetsByTitle } from '../utils/loadFinalAssets'
import toast from 'react-hot-toast'

// 🔄 Phase → 관련 Step → 다음 Phase 순 정렬 함수
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

  // 🔹 초기 프로젝트 로딩
  useEffect(() => {
    const fetchInitial = async () => {
      const data = await loadFinalAssets(userId, projectId)
      const sorted = sortByPhaseThenStep(data)
      setReviewGroups([{ title: projectTitle, assets: sorted }])
    }
    fetchInitial()
  }, [userId, projectId, projectTitle])

  // 🔹 다른 프로젝트 불러오기
  const handleLoadOtherProject = async () => {
    if (!otherTitle) return
    const { data, projectId: otherId, projectTitle: fetchedTitle } = await loadFinalAssetsByTitle(userId, otherTitle)

    if (!data || data.length === 0) {
      toast.error('No assets found for that project.')
      return
    }

    if (reviewGroups.some(group => group.title === fetchedTitle)) {
      toast('Already loaded.')
      return
    }

    const sorted = sortByPhaseThenStep(data)
    setReviewGroups(prev => [...prev, { title: fetchedTitle, assets: sorted }])
    setOtherTitle('')
  }

  return (
    <div className="w-screen min-h-screen p-10 space-y-12">
      {/* 🔎 다른 프로젝트 입력 */}
      <div className="flex gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="Enter another project title"
          value={otherTitle}
          onChange={(e) => setOtherTitle(e.target.value)}
          className="border rounded px-3 py-1"
        />
        <button
          onClick={handleLoadOtherProject}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Load Project
        </button>
      </div>

      {/* 🧾 리뷰 카드 그룹 */}
      {reviewGroups.length === 0 ? (
        <div className="text-gray-500">No saved assets to review.</div>
      ) : (
        reviewGroups.map((group, idx) => (
          <div key={idx}>
            <h2 className="text-xl font-bold mb-3">{group.title}</h2>
            <div className="flex gap-6 overflow-x-auto flex-nowrap pb-4">
              {group.assets.map((asset, i) => (
                <ReviewCard key={`${group.title}-${i}`} asset={asset} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}











