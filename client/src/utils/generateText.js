export async function generateText(prompt) {
  const res = await fetch('http://localhost:3000/api/text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const errMsg = (await res.json().catch(() => null))?.error;
    throw new Error(errMsg || 'Failed to generate text');
  }

  const data = await res.json();
  return data.text;
}


  