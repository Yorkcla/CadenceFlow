// src/pages/Review.jsx
import React, { useEffect, useState } from 'react'
import useStore from '../store/useStore'
import ReviewCard from '../components/ReviewCard'
import { loadFinalAssets, loadFinalAssetsByTitle } from '../utils/loadFinalAssets'
import toast from 'react-hot-toast'

export default function Review() {
  const { userId, projectId, projectTitle } = useStore()
  const [reviewGroups, setReviewGroups] = useState([])
  const [otherTitle, setOtherTitle] = useState('')

  useEffect(() => {
    const fetchInitial = async () => {
      const data = await loadFinalAssets(userId, projectId)
      setReviewGroups([{ title: projectTitle, assets: data }])
    }
    fetchInitial()
  }, [userId, projectId, projectTitle])

  const handleLoadOtherProject = async () => {
    if (!otherTitle) return
    const { data, projectId: otherId, projectTitle: fetchedTitle } = await loadFinalAssetsByTitle(userId, otherTitle)

    if (!data || data.length === 0) {
      toast.error('No assets found for that project.')
      return
    }

    // 중복 방지
    if (reviewGroups.some(group => group.title === fetchedTitle)) {
      toast('Already loaded.')
      return
    }

    setReviewGroups(prev => [...prev, { title: fetchedTitle, assets: data }])
    setOtherTitle('')
  }

  return (
    <div className="w-screen min-h-screen p-10 space-y-12">
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









