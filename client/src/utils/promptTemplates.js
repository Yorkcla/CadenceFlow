export function makePhaseTextPrompt(userInput) {
  return `Rewrite this storyboard phase to summarize the tasks in one concise sentence:\n"${userInput}"`;
}

export function makeStepTextPrompt(userInput) {
  return `Rewrite this storyboard step to clearly describe a specific task in one concise sentence:\n"${userInput}"`;
}

export function makeSoundDesignPrompt(config) {
  const { cognitivePhase, interactionIntent, urgency } = config;

  return `
Given the following user context:
- Emotional flow phase: ${cognitivePhase}
- Interaction intent: ${interactionIntent}
- Level of urgency: ${urgency}

Generate a JSON object describing a short sound composed of up to 4 notes. Each note should include:
- pitch: scientific pitch notation (e.g., "c3", "d#4", "g5")
- rhythm: the start time in seconds (e.g., 0, 0.5, 1.2)
- duration: how long the note lasts in seconds (e.g., 0.1, 0.5, 1)

Also include a master volume level in decibels (default: -6 dB, max: 0 dB).

Output format:
{
  "notes": [
    { "pitch": "c3", "rhythm": 0, "duration": 1 },
    { "pitch": "e3", "rhythm": 0.5, "duration": 0.5 },
    { "pitch": "g3", "rhythm": 1.0, "duration": 0.75 }
  ],
  "volume": -6
}

Only return a valid JSON object. Do not include explanations or any extra text.
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
    start: 'tonic function (e.g., C major: C, E, G)',
    build: 'subdominant function (e.g., F major: F, A, C)',
    peak: 'dominant function (e.g., G major: G, B, D)',
    ease: 'submediant function (e.g., A minor: A, C, E)',
    end: 'tonic function (e.g., C, E, G)',
    attention: 'non-harmonic or tension notes (e.g., D#, F#, Bb)'
  }

  const promptLines = pitchGroups
    .map(({ pitch, cognitivePhase }, i) => {
      const role = roleMap[cognitivePhase] || 'freely choose harmonically valid notes'
      return `${i + 1}. ${pitch.join(', ')} // Try to match: ${role}`
    })
    .join('\n')

  return `
You are a helpful assistant that understands musical harmony, voice leading, and tonal functions.

Each pitch array below corresponds to a user interaction phase. Your task is to refine the pitch content of each array to reflect its intended harmonic function, while also considering musical flow across arrays — including functional harmonic progression, melodic contour, and voice leading between them.

Instructions:
- Maintain the number of pitches per group (no adding or removing)
- Do not change registers drastically
- Use the suggested harmonic role for each phase to guide your improvement
- Return only the new pitch sequences, one per line, no explanations or numbering

Here are the sequences:
${promptLines}

Output example:
C4, E4, G4  
F4, A4, C5  
G3, B3, D4  
`.trim()
}

