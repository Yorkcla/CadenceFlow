export async function handleGenAIRequest(req, res) {
  try {
    const { prompt } = req.body

    // 나중에: const result = await generateFromPrompt(prompt)
    const result = `Generated result for: ${prompt}`

    res.json({ response: result })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'GenAI request failed' })
  }
}

