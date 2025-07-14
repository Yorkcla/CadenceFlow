import JSZip from 'jszip'

export async function createProjectZip(projectId, assets) {
  const zip = new JSZip()
  zip.file('project-data.json', JSON.stringify(assets, null, 2))

  /* 🚩 공용 헬퍼 */
  const addFile = async (url, folder, filename) => {
    if (!url) return             // null / undefined 건너뛰기
    try {
      const res  = await fetch(url)
      if (!res.ok) throw new Error('fetch failed')
      const blob = await res.blob()
      zip.folder(folder).file(filename, blob)
    } catch (e) {
      console.warn('⚠️  skip (fetch error):', url)
    }
  }

  /* 🗂️ 각 에셋 처리 */
  const tasks = assets.flatMap(asset => {
    const { id, imageUrl, soundUrl } = asset
    return [
      addFile(imageUrl, 'images', `${id}.jpg`),
      // 🔑 WAV 확장자 & soundUrl 사용
      addFile(soundUrl, 'audio', `${id}.wav`)
    ]
  })

  await Promise.all(tasks)
  return zip.generateAsync({ type: 'blob' })
}
