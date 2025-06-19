export async function handleGenAIRequest(req, res) {
    try {
      const { prompt } = req.body;
      // ⚠️ 여기에 실제 GenAI API 연동 코드 추가 예정
      res.json({ response: `Generated result for: ${prompt}` });
    } catch (error) {
      res.status(500).json({ error: 'GenAI request failed' });
    }
  }