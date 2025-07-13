export function makePhaseTextPrompt(userInput) {
  return `다음 상황 묘사 구체적이지만 명확하게 바꿔줘:\n"${userInput}"`;
}

export function makeStepTextPrompt(userInput) {
  return `다음 상황 묘사 구체적이지만 명확하게 바꿔줘:\n"${userInput}"`;
}

export function makeSoundDesignPrompt(config) {
  const { cognitivePhase, interactionIntent, urgency } = config;

  return `
Given the following user context:
- Emotional flow phase: ${cognitivePhase}
- Interaction intent: ${interactionIntent}
- Level of urgency: ${urgency}

Generate a JSON object describing a short sound composed of multiple notes. Each note should have:
- pitch: in scientific pitch notation (e.g., "c3", "d#4", "g5")
- rhythm: when the note starts (e.g., 0, 0.5, 1.2)
- duration: how long the note lasts (e.g., 0.1, 0.5, 1)
Also include a master volume level (in dB), which defaults to -6 and should not exceed 0 dB.

Output format (as valid JSON):
{
  "notes": [
    { "pitch": "c3", "rhythm": 0, "duration": 1 },
    { "pitch": "e3", "rhythm": 0.5, "duration": 0.5 },
    { "pitch": "g3", "rhythm": 1.0, "duration": 0.75 }
  ],
  "volume": -6
}
Return only the JSON. Do not include explanations or extra text.
  `.trim();
}


