export function makePhaseTextPrompt(userInput) {
  return `다음 상황 묘사 구체적이지만 명확하게 바꿔줘:\n"${userInput}"`;
}

export function makeStepTextPrompt(userInput) {
  return `다음 상황 묘사 구체적이지만 명확하게 바꿔줘:\n"${userInput}"`;
}

export function makeSoundDesignPrompt({ cognitivePhase, interactionIntent, urgency }) {
  return `
다음 사용자 시나리오에 어울리는 사운드 디자인을 생성해줘.
- 인지적 흐름 단계: ${cognitivePhase}
- 인터랙션 목적: ${interactionIntent}
- 긴급도: ${urgency}

아래와 같은 형식으로 pitch[], rhythm[], duration[], instrument, volume 등을 JSON으로 알려줘.
`.trim();
}

