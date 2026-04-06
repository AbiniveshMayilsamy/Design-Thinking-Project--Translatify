# Translatify — AI Translation System

A full-stack AI-powered translation web application that supports real-time voice, audio file, and video file translation into multiple languages.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Project](#running-the-project)
- [API Reference](#api-reference)
- [Authentication](#authentication)
- [Admin Panel](#admin-panel)
- [Supported Languages](#supported-languages)
- [Demo Accounts](#demo-accounts)
- [Environment Variables](#environment-variables)
- [Known Issues & Fixes](#known-issues--fixes)

---

## Project Overview

Translatify is a web application that allows users to:
- Record voice in real-time and get instant translation with audio output
- Upload audio files (MP3, WAV, etc.) and receive translated text + audio
- Upload video files and get transcription, translation, subtitles, and translated audio
- Manage users and view translation history via an Admin Panel

---

## Features

| Feature | Description |
|---|---|
| Voice Recording | Real-time mic recording with WebSocket streaming |
| Audio File Upload | Upload MP3/WAV/OGG/M4A/FLAC/WebM for translation |
| Video File Upload | Upload MP4/AVI/MOV/MKV/WebM, extracts audio and translates |
| AI Transcription | OpenAI Whisper (local) or Groq Whisper API (cloud) |
| AI Translation | Facebook NLLB-200 (600M) model — 28 languages |
| Text-to-Speech | Google TTS (gTTS) for translated audio output |
| JWT Authentication | Secure login/register with role-based access |
| Admin Dashboard | Manage users, view stats, translation history |
| Real-time WebSocket | Socket.IO for live voice translation |
| MongoDB Support | Persistent user and history storage (optional) |
| Fallback Mode | Works without MongoDB using built-in dummy accounts |

---

## Tech Stack

### Backend
| Package | Version | Purpose |
|---|---|---|
| Flask | 3.0.3 | Web framework |
| Flask-SocketIO | 5.3.6 | WebSocket support |
| Flask-CORS | 4.0.1 | Cross-origin requests |
| Flask-JWT-Extended | 4.6.0 | JWT authentication |
| openai-whisper | 20231117 | Local speech-to-text |
| transformers | 4.40.0 | NLLB-200 translation model |
| gTTS | 2.5.1 | Text-to-speech |
| moviepy | 1.0.3 | Video audio extraction |
| torch | 2.2.2 | ML model inference |
| pymongo | 4.7.2 | MongoDB database |
| bcrypt | 4.1.3 | Password hashing |
| sentencepiece | 0.2.0 | Tokenizer for NLLB |

### Frontend
| Package | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Framer Motion | Animations |
| Socket.IO Client | Real-time WebSocket |
| React Dropzone | File upload UI |

---

## Project Structure

```
Design - Thinking/
├── backend/
│   ├── ml/
│   │   ├── __init__.py
│   │   ├── transcriber.py     # Whisper speech-to-text
│   │   ├── translator.py      # NLLB-200 translation
│   │   ├── tts.py             # Google TTS audio generation
│   │   └── video.py           # Video audio extraction (moviepy)
│   ├── uploads/               # Temporary uploaded files
│   ├── outputs/               # Generated TTS audio files
│   ├── app.py                 # Main Flask application & all API routes
│   ├── db.py                  # MongoDB database helpers
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AudioUpload.jsx    # Audio file translation UI
│   │   │   ├── VideoUpload.jsx    # Video file translation UI
│   │   │   ├── VoiceRecorder.jsx  # Real-time voice recording UI
│   │   │   ├── ResultPanel.jsx    # Translation result display
│   │   │   ├── AdminPage.jsx      # Admin dashboard
│   │   │   ├── LoginPage.jsx      # Login/Register page
│   │   │   ├── HomePage.jsx       # Landing page
│   │   │   ├── Header.jsx         # Navigation header
│   │   │   ├── LangRow.jsx        # Language selector
│   │   │   ├── DropZone.jsx       # File drag & drop
│   │   │   ├── SegmentList.jsx    # Video subtitle segments
│   │   │   ├── WaveForm.jsx       # Audio waveform visualizer
│   │   │   └── TabBar.jsx         # Tab navigation
│   │   ├── AuthContext.jsx        # JWT auth state management
│   │   ├── ToastContext.jsx       # Toast notifications
│   │   ├── socket.js              # Socket.IO client setup
│   │   ├── App.jsx                # Root component & routing
│   │   └── main.jsx               # React entry point
│   ├── package.json
│   └── vite.config.js             # Vite config (port 3000, proxy to 5000)
├── start.bat                      # Start both servers (Windows)
├── start.ps1                      # Start both servers (PowerShell)
└── README.md                      # This file
```

---

## Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- ffmpeg (required for Whisper audio decoding)
- MongoDB (optional — app works without it)

### Install ffmpeg (Windows)
```powershell
winget install --id Gyan.FFmpeg -e
```
Then restart your terminal.

### Backend Setup
```powershell
cd "d:\Design - Thinking\backend"
pip install -r requirements.txt
```

### Frontend Setup
```powershell
cd "d:\Design - Thinking\frontend"
npm install
```

---

## Running the Project

### Option 1 — Run both at once (recommended)
```powershell
cd "d:\Design - Thinking"
.\start.bat
```

### Option 2 — Run separately

**Backend** (runs on http://localhost:5000):
```powershell
cd "d:\Design - Thinking\backend"
python app.py
```

**Frontend** (runs on http://localhost:3000):
```powershell
cd "d:\Design - Thinking\frontend"
npm run dev
```

Then open **http://localhost:3000** in your browser.

---

## API Reference

### Auth Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and get JWT token |
| GET | /api/auth/me | Get current user info |

### Translation Endpoints (JWT required)
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/translate-audio | Upload audio file → transcribe + translate + TTS |
| POST | /api/translate-video | Upload video file → extract audio + transcribe + translate |
| POST | /api/transcribe | Transcribe audio file only |
| POST | /api/translate | Translate plain text |
| POST | /api/tts | Generate TTS audio from text |
| GET | /api/languages | Get list of supported languages |
| GET | /api/history | Get user's translation history |

### Admin Endpoints (Admin JWT required)
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/admin/stats | Get system statistics |
| GET | /api/admin/users | Get all users |
| PUT | /api/admin/users/{email}/role | Update user role |
| DELETE | /api/admin/users/{email} | Delete user |
| GET | /api/admin/history | Get all translation history |
| POST | /api/admin/create-admin | Create new admin user |

### WebSocket Events (Socket.IO)
| Event | Direction | Description |
|---|---|---|
| connect | Server → Client | Connection established |
| stream_audio | Client → Server | Send recorded audio bytes |
| transcription | Server → Client | Transcribed text result |
| translation | Server → Client | Translated text result |
| tts_ready | Server → Client | TTS audio URL ready |
| status | Server → Client | Processing status updates |
| error | Server → Client | Error message |

---

## Authentication

- Uses **JWT (JSON Web Tokens)** via Flask-JWT-Extended
- Token is stored in `localStorage` as `translatify_token`
- All translation API calls require `Authorization: Bearer <token>` header
- Tokens do not expire (configured for development)
- Two roles: `user` and `admin`

---

## Admin Panel

Access the admin panel by logging in with an admin account. Features:
- View total users, translations, and system stats
- Promote/demote users between `user` and `admin` roles
- Delete users
- View full translation history across all users
- Create new admin accounts

---

## Supported Languages

| Code | Language |
|---|---|
| en | English |
| fr | French |
| de | German |
| es | Spanish |
| it | Italian |
| pt | Portuguese |
| nl | Dutch |
| ru | Russian |
| zh | Chinese |
| ja | Japanese |
| ar | Arabic |
| hi | Hindi |
| ko | Korean |
| tr | Turkish |
| pl | Polish |
| sv | Swedish |
| da | Danish |
| fi | Finnish |
| cs | Czech |
| ro | Romanian |
| uk | Ukrainian |
| vi | Vietnamese |
| th | Thai |
| id | Indonesian |
| ms | Malay |
| he | Hebrew |
| fa | Persian |
| bn | Bengali |

---

## Demo Accounts

These accounts work even without MongoDB:

| Role | Email | Password |
|---|---|---|
| Admin | admin@translatify.com | admin123 |
| User | user@translatify.com | user123 |

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| MONGO_URI | mongodb://localhost:27017/translatify | MongoDB connection string |
| WHISPER_MODEL | small | Whisper model size (tiny/base/small/medium/large-v3) |
| GROQ_API_KEY | — | Groq API key for cloud Whisper (optional) |
| ASSEMBLYAI_KEY | — | AssemblyAI key as fallback (optional) |

Set them before starting the backend:
```powershell
$env:WHISPER_MODEL = "small"
$env:MONGO_URI = "mongodb://localhost:27017/translatify"
python app.py
```

---

## Known Issues & Fixes

### [WinError 2] The system cannot find the file specified
- **Cause:** ffmpeg is not installed or not in PATH
- **Fix:** Install ffmpeg via `winget install --id Gyan.FFmpeg -e` and restart terminal

### Translation result not showing
- **Cause:** JWT token not sent with API request
- **Fix:** Already fixed in AudioUpload.jsx and VideoUpload.jsx — Authorization header added

### MongoDB unavailable
- **Cause:** MongoDB not running locally
- **Fix:** App works without MongoDB using built-in demo accounts. Install MongoDB or use MongoDB Atlas cloud.

### Frontend on wrong port
- **Cause:** Port 3000 already in use, Vite auto-switches to 3001
- **Fix:** Free port 3000 or open http://localhost:3001

---

## License

This project is for educational and demonstration purposes.
