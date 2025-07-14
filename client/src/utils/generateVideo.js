export async function generateVideo(prompt) {
    const res = await fetch('http://localhost:3000/api/video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
  
    if (!res.ok) {
      const errMsg = (await res.json().catch(() => null))?.error
      throw new Error(errMsg || 'Failed to generate video')
    }
  
    const data = await res.json()
    return data.videoUrl // 백엔드가 signed URL 반환 시
  }
