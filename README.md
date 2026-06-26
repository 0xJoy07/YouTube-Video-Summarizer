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
    <a href="#deployment">Deployment</a> •
    <a href="#project-structure">Project Structure</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
    <img src="https://img.shields.io/badge/AI-OpenRouter-8B5CF6?style=for-the-badge" alt="OpenRouter" />
    <img src="https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/Tunnel-Cloudflare-F38020?style=for-the-badge&logo=cloudflare" alt="Cloudflare" />
  </p>
</div>

<hr/>

## ✨ Features

- ⚡️ **Instant Processing**: Extract transcripts from any public YouTube video with captions.
- 🧠 **Advanced AI Summarization**: Connect your OpenRouter API key to summarize massive transcripts using state-of-the-art LLMs.
- 🕒 **Smart Timestamps**: The AI intelligently groups concepts into clickable timeline chapters.
- 🎯 **Key Takeaways**: Instantly grasp the core arguments and actionable insights from the content.
- 🔒 **Privacy First**: Your API key is kept only in memory during the session — it's cleared on every page reload and never stored on any server.
- 📖 **Local History**: Automatically saves your generated summaries to the browser for easy retrieval.
- 🌐 **Multi-Language Support**: Accepts transcripts in 80+ languages — the AI translates everything to English.
- 🛡️ **Proxy Support**: Built-in support for HTTP/HTTPS proxies to bypass YouTube IP restrictions on cloud deployments.
- 🔗 **Cloudflare Tunnel**: Run the backend locally and expose it securely via Cloudflare Tunnel for production use.

## 🚀 Quick Start

Follow these steps to get the project running locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16+)
- [Python](https://www.python.org/) (3.9+)
- [Cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) (optional, for exposing the backend publicly)

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

### 4. (Optional) Expose Backend via Cloudflare Tunnel
To make your local backend accessible from the deployed frontend:
```bash
cloudflared tunnel --url http://localhost:8000
```
This generates a public URL like `https://xxxxx.trycloudflare.com` that you can use as `VITE_API_BASE_URL`.

> **Tip:** On Windows, double-click `start-backend.bat` to start both the backend server and the Cloudflare tunnel in one go.

## 🛠 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Lucide Icons
- Custom SPA Routing

**Backend:**
- FastAPI (Python)
- HTTPX (Async API Calls)
- YouTube Transcript API (with proxy support)
- Uvicorn

**Infrastructure:**
- Vercel (Frontend hosting)
- Cloudflare Tunnel (Backend exposure)
- OpenRouter (AI gateway — default model: `openrouter/free`)

## 💡 How it Works

1. **Submit a URL**: Paste a YouTube link in the frontend dashboard.
2. **Fetch Transcript**: The FastAPI backend extracts the Video ID and downloads YouTube captions using `youtube-transcript-api`. Supports 80+ languages.
3. **AI Generation**: The transcript is packaged into an engineered prompt and sent to OpenRouter via an async HTTP call using your API key.
4. **JSON Parsing**: The backend cleans and parses the AI's structured JSON response (title, summary, timestamps, key takeaways).
5. **Render Results**: The frontend displays the full summary with timestamps, key takeaways, and a detailed transcript summary.

## 🚢 Deployment

### Frontend → Vercel

1. Push your code to GitHub.
2. Import the `frontend` folder into [Vercel](https://vercel.com).
3. Set the environment variable:
   ```env
   VITE_API_BASE_URL=https://your-cloudflare-tunnel-url.trycloudflare.com
   ```
4. Deploy. The included `vercel.json` handles SPA routing automatically.

> **Note:** The tunnel URL changes every time you restart `cloudflared`. Update the Vercel env var and redeploy when this happens.

### Backend → Local + Cloudflare Tunnel

YouTube blocks transcript requests from cloud provider IPs (AWS, GCP, Render, etc.). The recommended approach is to run the backend locally and expose it via Cloudflare Tunnel:

```bash
# Terminal 1: Start the backend
cd backend
uvicorn app:app --reload

# Terminal 2: Start the tunnel
cloudflared tunnel --url http://localhost:8000
```

Or simply run the included script on Windows:
```bash
start-backend.bat
```

### Backend → Cloud (with Proxy)

If you prefer a fully cloud-hosted backend (e.g., Render), set the `PROXY_URL` environment variable to route YouTube requests through a **residential** proxy:

```env
PROXY_URL=http://username:password@proxy-ip:port
```

> ⚠️ **Important:** Datacenter proxy IPs are also blocked by YouTube. You need **residential** proxies (e.g., from [Webshare Residential](https://www.webshare.io/)).

## 📁 Project Structure

```
YouTube-Video-Summarizer/
├── backend/
│   ├── app.py              # FastAPI server with transcript fetching & AI summarization
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Environment variables (PROXY_URL)
├── frontend/
│   ├── src/
│   │   ├── pages/          # LandingPage, DashboardPage, HowItWorksPage, UseCasesPage, DocsPage, HistoryPage
│   │   ├── components/     # Button, SiteShell, StatusBlock
│   │   ├── services/       # API client, caching
│   │   ├── hooks/          # Custom SPA routing
│   │   ├── utils/          # Summary normalization, YouTube helpers
│   │   └── App.jsx         # Route definitions
│   ├── vercel.json         # SPA rewrite rules for Vercel
│   └── package.json
├── start-backend.bat       # One-click backend + tunnel launcher (Windows)
└── README.md
```

## 🔑 Environment Variables

| Variable | Where | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Frontend (Vercel) | URL of the backend API (Cloudflare tunnel or cloud URL) |
| `PROXY_URL` | Backend (optional) | HTTP proxy URL for YouTube transcript requests on cloud deployments |

---

<div align="center">
  <p>Built with ❤️ for creators, students, and researchers.</p>
</div>
