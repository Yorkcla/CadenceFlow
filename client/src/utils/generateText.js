export async function generateText(prompt) {
    const res = await fetch('http://localhost:4000/api/genai/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
  
    if (!res.ok) {
      throw new Error('Failed to generate text')
    }
  
    const data = await res.json()
    return data.result
  }
  