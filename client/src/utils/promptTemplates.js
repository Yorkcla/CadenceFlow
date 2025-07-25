export function makePhaseTextPrompt(userInput) {
  return `Rewrite this phase description clearly and naturally. Return only the revised sentence:\n${userInput}`;
}

export function makeStepTextPrompt(userInput) {
  return `Rewrite this step description clearly and naturally. Return only the revised sentence:\n${userInput}`;
}

export function makeSoundDesignPrompt(config) {
  const { cognitivePhase, interactionIntent, urgency } = config;

  return `
You are designing a short interactive sound (max 4 notes) that communicates the user's current interaction context.

User Context:
- Cognitive phase (emotional state): ${cognitivePhase}
- Interaction intent: ${interactionIntent}
- Urgency level: ${urgency}

Instructions:
- Design a sequence using pitch, rhythm, and duration that clearly reflects this context.
- You must include both chordal (simultaneous) and rhythmic (sequential) notes.
- Use expressive and functional tones — extended, altered, or conventional pitches are welcome.
- Keep the sound concise but emotionally communicative.

Formatting:
- Output must be a **single valid JSON object** (no explanation or text).
- Each note includes:
  - "pitch": scientific pitch notation (e.g., "c3", "d#4")
  - "rhythm": onset time in seconds (e.g., 0.0, 0.3)
  - "duration": duration in seconds (e.g., 0.2, 0.5)

- Include one field for:
  - "volume": master volume in decibels (e.g., -6, max 0)

Example Output:
{
  "notes": [
    { "pitch": "c3", "rhythm": 0.0, "duration": 0.4 },
    { "pitch": "g4", "rhythm": 0.0, "duration": 0.4 },
    { "pitch": "d5", "rhythm": 0.5, "duration": 0.6 }
  ],
  "volume": -5
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
    start: 'tonic function (e.g., C, E, G)',
    build: 'subdominant function (e.g., F, A, C)',
    peak: 'dominant function (e.g., G, B, D)',
    ease: 'submediant function (e.g., A, C, E)',
    end: 'tonic function (e.g., C, E, G)',
    attention: 'non-harmonic or tension notes (e.g., D#, F#, Bb)'
  }

  const promptLines = pitchGroups
    .map(({ pitch, cognitivePhase }, i) => {
      const role = roleMap[cognitivePhase] || 'harmonically suitable notes of your choice'
      return `// Phase ${i + 1} (${cognitivePhase}): ${pitch.join(', ')} — Target: ${role}`
    })
    .join('\n')

  return `
You are a music assistant with knowledge of tonal harmony, voice leading, and functional progressions.

Below are pitch groups representing different phases in an interaction. Please revise them so that:
- Each group fits its harmonic role
- All groups together form a coherent progression in a consistent key (avoid C major)
- The flow between groups is smooth (good voice leading, melodic contour)
- The number of notes per group stays the same
- The musical character of each group is preserved as much as possible

Only return the revised pitch groups, one per line, with no extra text or numbering.

Input:
${promptLines}

Output (example):
C4, E4, G4  
F4, A4, C5  
G3, B3  
`.trim()
}
