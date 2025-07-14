import JSZip from 'jszip'

export async function createProjectZip(projectId, assets) {
  const zip = new JSZip()
  zip.file('project-data.json', JSON.stringify(assets, null, 2))

  const addFile = async (url, folder, filename) => {
    if (!url) return
    const res = await fetch(url)
    const blob = await res.blob()
    zip.folder(folder).file(filename, blob)
  }

  const tasks = assets.flatMap(asset => {
    const { id, imageUrl, audioUrl, videoUrl } = asset
    return [
      addFile(imageUrl, 'images', `${id}.jpg`),
      addFile(audioUrl, 'audio', `${id}.mp3`),
      addFile(videoUrl, 'video', `${id}.mp4`),
    ]
  })

  await Promise.all(tasks)
  return zip.generateAsync({ type: 'blob' })
}
