# CadenceFlow

CadenceFlow is a web-based design tool for creating interaction sounds using the musical principle of **tension and release**. It guides designers, including those without a background in music, through a three-stage process, with support from generative AI.

> The paper that describes CadenceFlow is currently under review. Citation details will be added once it is published.

## Workflow

1. **Storyboarding**: Break an interaction scenario into *Phases* and *Steps*, each with a description and an image (uploaded, drawn, or AI-generated).
2. **Sounding**: Annotate the selected cards with a cognitive state, interaction intent, and urgency. CadenceFlow suggests pitch, rhythm, and duration for each card, and the designer customises these suggestions and picks a timbre. Pressing the **CadenceFlow!** button then rearranges the pitches across the sequence to follow tonal tension and release. Sounds are synthesised in the browser with Tone.js.
3. **Reviewing**: Play back the storyboard with its synchronised sounds, compare several projects side by side, and generate preview videos.

The in-app guide ([client/public/docs/onboarding.md](client/public/docs/onboarding.md)) describes each stage in more detail.

## Tech Stack

- **Client**: React 18, Vite, Tailwind CSS, Zustand, Tone.js, p5.js
- **Server**: Node.js and Express, which proxy requests to the Google Gemini API (text via `gemini-2.5-flash-lite`, images via `gemini-2.0-flash-preview-image-generation`, video via `veo-2.0-generate-001`)
- **Backend services**: Firebase Authentication, Firestore, and Storage

```
CadenceFlow/
├── client/   # React front end (pages, components, Zustand store, Firebase utils)
└── server/   # Express API: /api/text, /api/image, /api/video
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)
- A Firebase project with Authentication, Firestore, and Storage enabled

### 1. Server

```bash
cd server
npm install
echo "GEMINI_API_KEY=your_key_here" > .env   # PORT is optional and defaults to 3000
npm run dev
```

### 2. Client

Replace the `firebaseConfig` object in [client/src/utils/firebase.js](client/src/utils/firebase.js) with the configuration of your own Firebase project. Then run:

```bash
cd client
npm install
npm run dev
```

Open the URL that Vite prints (by default `http://localhost:5173`). The client expects the server at `http://localhost:3000`.

## License

Released under the [MIT License](LICENSE).
