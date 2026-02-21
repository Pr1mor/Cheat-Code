# CheatCode 🎯

An AI-powered mock technical interview simulator that conducts real voice-based DSA interviews. Built at a 24-hour hackathon.

## What It Does

CheatCode puts you in a real interview setting. Select a difficulty, and an AI interviewer reads you a LeetCode-style problem, listens to your approach via voice, challenges your logic, asks for time and space complexity, and reviews your final code — all without ever giving away the answer.

## Tech Stack

**Frontend**
- Next.js 16
- React 19
- MediaRecorder API (voice capture)
- Web Audio API (audio playback)

**Backend**
- Node.js + Express
- Google Gemini 2.5 Flash (AI Interviewer)
- OpenAI Whisper (Speech to Text)
- ElevenLabs (Text to Speech)
- Multer (audio file handling)

## Project Structure

```
CheatCode/
├── frontend/          # Next.js app
│   ├── app/
│   │   ├── page.js              # Landing page (difficulty selection)
│   │   └── interview/
│   │       └── page.jsx         # Interview page
│   └── components/
│       └── AudioRecorder.jsx    # Mic capture + audio playback
├── backend/
│   ├── Interviewer.js           # Express server + Gemini logic
│   ├── audioServices.js         # Whisper STT + ElevenLabs TTS
│   ├── questions.json           # Question bank
│   └── .env                     # API keys
└── package.json                 # Root package with concurrently
```

## How It Works

```
User speaks → AudioRecorder captures blob
→ Whisper transcribes audio to text
→ Gemini responds as strict FAANG interviewer
→ ElevenLabs converts response to audio
→ Browser plays AI voice back to user
```

## Getting Started

### Prerequisites
- Node.js 18+
- API keys for Gemini, OpenAI, and ElevenLabs

### Installation

1. Clone the repo:
```bash
git clone https://github.com/Pr1mor/Cheat-Code.git
cd Cheat-Code
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Install root dependencies:
```bash
cd ..
npm install
```

5. Set up your `.env` file in the backend folder:
```
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
ELEVENLABS_API_KEY=your_elevenlabs_key
ELEVENLABS_VOICE_ID=your_voice_id
PORT=8080
```

### Running the App

From the root folder:
```bash
npm start
```

This starts both the backend (port 8080) and frontend (port 3000) simultaneously.

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Voice-based interviewing** — speak your approach, the AI listens and responds
- **Difficulty selection** — Easy, Medium, and Hard question pools
- **Persistent chat memory** — the interviewer remembers everything said in the session
- **Code submission** — write your solution and get logic-based feedback (syntax errors ignored)
- **AI voice responses** — the interviewer speaks back using ElevenLabs TTS
- **Question display** — problem statement appears on screen once the interview begins

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/start` | Starts a new session with a random question |
| POST | `/chats` | Sends voice audio, returns AI text + audio response |
| POST | `/submit` | Submits code for logic-based review |
| POST | `/clear` | Resets chat history |

## Team

| Member | Role |
|--------|------|
| Zeel | AI & Prompt Engineer (Gemini backend) |
| Pratham | Pipeline Lead (Whisper + ElevenLabs) |
| Priyal | Frontend Voice Engineer (mic + audio) |
| Noor | UI/UX Architect (Next.js frontend) |

## Hackathon

Built at a 24-hour hackathon. Submitted on DevPost: [CheatCode](https://devpost.com/software/1200037)
