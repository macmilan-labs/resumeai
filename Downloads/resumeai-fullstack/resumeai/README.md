# ResumeAI

AI-powered resume analyser for Indian job seekers.

## Setup

```bash
# Install all dependencies
npm run install:all

# Add your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > server/.env
echo "PORT=3001" >> server/.env

# Run both client and server
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:3001

## Stack
- **Frontend**: React + Vite
- **Backend**: Express.js
- **AI**: Google Gemini 1.5 Flash
