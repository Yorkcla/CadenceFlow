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
  const promptLines = pitchGroups
    .map(({ pitch }, i) => `${i + 1}. ${pitch.join(', ')}`)
    .join('\n')

  return `
You are a helpful assistant who understands musical harmony and voice leading.

Given the following pitch sequences, improve each one by making it more harmonically interesting or smoother in voice leading.

Instructions:
- Do NOT add or remove notes: the number of pitches in each sequence must stay the same
- Do NOT change the register drastically (keep similar octave ranges)
- Do NOT include numbering or explanations in your response

Each line corresponds to a separate group:
${promptLines}

Output format:
Just return one line per group with improved pitches, like this:
C4, E4, G4
D4, F4, A4

Only return the improved sequences. Do NOT include explanations or numbering.
`.trim()
}

