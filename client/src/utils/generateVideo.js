export async function generateVideo({ prompt }) {
  const res = await fetch('http://localhost:3000/api/video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }), // 이제 prompt는 진짜 문자열임
  })

  if (!res.ok) {
    const errMsg = (await res.json().catch(() => null))?.error
    throw new Error(errMsg || 'Failed to generate video')
  }

  const data = await res.json()
  return data.videoUrl
}
