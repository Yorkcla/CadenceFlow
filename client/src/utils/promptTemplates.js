export function makePhaseTextPrompt(userInput) {
  return `Rewrite this storyboard phase to summarize the tasks in one concise sentence:\n"${userInput}"`;
}

export function makeStepTextPrompt(userInput) {
  return `Rewrite this storyboard step to clearly describe a specific task in one concise sentence:\n"${userInput}"`;
}

export function makeSoundDesignPrompt(config) {
  const { cognitivePhase, interactionIntent, urgency } = config;

  return `
Design a short interactive sound sequence (max 4 notes) that reflects the user's current context:

User Context:
- Emotional flow phase: ${cognitivePhase}
- Interaction intent: ${interactionIntent}
- Level of urgency: ${urgency}

Instructions:
- Focus on combinations of pitch, rhythm, and duration that clearly communicate intent.
- Some notes must play simultaneously (chords), others sequentially (rhythmic patterns).
- Use a mix of conventional and expressive tones, including extended or altered pitches.
- Be concise yet expressive — prioritise clarity and emotional fit.

Note format:
Each note must include:
- "pitch": in scientific pitch notation (e.g., "c3", "d#4", "g5")
- "rhythm": onset time in seconds (e.g., 0, 0.5, 1.2)
- "duration": note length in seconds (e.g., 0.2, 0.6, 1)

Also include:
- "volume": overall master volume in decibels (e.g., -6, max 0)

Output:
Return a single **valid JSON object** only. No explanations, text, or formatting outside the JSON.

Example:
{
  "notes": [
    { "pitch": "c3", "rhythm": 0, "duration": 0.5 },
    { "pitch": "f#4", "rhythm": 0.3, "duration": 0.2 },
    { "pitch": "d5", "rhythm": 0.6, "duration": 1.1 }
  ],
  "volume": -6
}
`.trim();
}

export const makePhaseImagePrompt = (description) => {
  return `Create a storyboard phase image that visually represents an overview of tasks: "${description}".`;
}

export const makeStepImagePrompt = (description) => {
  return `Create a storyboard step image that visually represents a specific task: "${description}".`;
}

export function makeVideoPrompt({ title, description }) {
  const prompt = `
Create a 6-second cinematic video based on the following storyboard element:

${title ? `Title: "${title}"\n` : ''}Description: "${description}" 

Visually interpret the story with cinematic style.
Do not include text or narration.
`.trim();

  return String(prompt); 
}

export function refinePitchesPrompt(pitchGroups) {
  const roleMap = {
    start: 'tonic function (e.g., C, E, G in C major)',
    build: 'subdominant function (e.g., F, A, C in C major)',
    peak: 'dominant function (e.g., G, B, D in C major)',
    ease: 'submediant function (e.g., A, C, E in C major)',
    end: 'tonic function (e.g., C, E, G in C major)',
    attention: 'non-harmonic or tension notes (e.g., D#, F#, Bb in C major)'
  }

  const promptLines = pitchGroups
    .map(({ pitch, cognitivePhase }, i) => {
      const role = roleMap[cognitivePhase] || 'harmonically valid notes of your choice'
      return `// Phase ${i + 1} (${cognitivePhase}): ${pitch.join(', ')} — Try to match: ${role}`
    })
    .join('\n')

  return `
You are a helpful assistant that understands tonal harmony, voice leading, and functional progressions.

Each pitch group below corresponds to a phase in user interaction. Your task is to refine each group of pitches so that:
- It fits its intended harmonic function, and all groups together contribute to a coherent overall progression in the same key
- It flows well into the next group (considering voice leading and melodic contour)
- It maintains the same number of notes (do not add or remove any)
- It preserves the overall design and character of the original group wherever possible

Return only the refined pitch sequences, one per line, without numbering or extra text.

Input:
${promptLines}

Output format (example):
C4, E4, G4, C5  
F4, A4, C5  
G3, B3  
`.trim()
}

