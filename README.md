<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=40&pause=1000&color=8B5CF6&center=true&vCenter=true&width=600&lines=Summ+AI;YouTube+Video+Summarizer;Save+hours+of+watch+time" alt="Typing SVG" />

  <p align="center">
    <strong>The most powerful AI ever deployed for YouTube content processing.</strong>
  </p>
  
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#how-it-works">How it Works</a> •
    <a href="#license">License</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
    <img src="https://img.shields.io/badge/AI-OpenRouter-8B5CF6?style=for-the-badge" alt="OpenRouter" />
    <img src="https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS" />
  </p>
</div>

<hr/>

## ✨ Features

- ⚡️ **Instant Processing**: Extract transcripts from any public YouTube video with captions.
- 🧠 **Advanced AI Summarization**: Connect your OpenRouter API key to summarize massive transcripts using state-of-the-art LLMs.
- 🕒 **Smart Timestamps**: The AI intelligently groups concepts into clickable timeline chapters.
- 🎯 **Key Takeaways**: Instantly grasp the core arguments and actionable insights from the content.
- 🔒 **Privacy First**: Your API keys never leave your browser session. All processing is stateless.
- 📖 **Local History**: Automatically saves your generated summaries locally so you don't lose them.

## 🚀 Quick Start

Follow these steps to get the project running locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16+)
- [Python](https://www.python.org/) (3.9+)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/youtube-video-summarizer.git
cd youtube-video-summarizer
```

### 2. Start the Backend
The backend runs on Python + FastAPI.
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload
```
*The backend will be running at `http://127.0.0.1:8000`.*

### 3. Start the Frontend
The frontend runs on React + Vite.
```bash
cd frontend
npm install
npm run dev
```
*The frontend will be running at `http://localhost:5173`.*

## 🛠 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Lucide Icons
- Custom Routing (SPA)

**Backend:**
- FastAPI (Python)
- HTTPX (Async API Calls)
- YouTube Transcript API
- Uvicorn

**AI Gateway:**
- OpenRouter (Default model: `openrouter/free`)

## 💡 How it works

1. **Submit a URL**: Paste a YouTube link in the frontend.
2. **Fetch Transcript**: The FastAPI backend intercepts the URL, extracts the Video ID, and downloads the official YouTube captions using `youtube-transcript-api`.
3. **AI Generation**: The transcript is packaged into an engineered prompt and sent to OpenRouter via an async HTTP call.
4. **JSON Parsing**: The backend cleans and parses the AI's response into strict JSON.
5. **Render Results**: The frontend displays the title, duration, chapters (timestamps), key takeaways, and a full text summary.

## 🔒 Environment Variables & Deployment

### Frontend (Vite)
If deploying to Vercel/Netlify, set the following environment variable:
```env
VITE_API_BASE_URL=https://your-backend-production-url.com
```
*Note: A `vercel.json` rewrite rule is already included for SPA routing.*

### Backend (FastAPI)
Ensure the host binds to `0.0.0.0` when deploying to platforms like Render or Heroku:
```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

---

