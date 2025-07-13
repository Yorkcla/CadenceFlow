export async function generateImage(prompt) {
  const res = await fetch('http://localhost:3000/api/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })
  const { image } = await res.json()        // base64 data URL
  return image
}



