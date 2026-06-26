import os
import re
import json
import httpx
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.proxies import GenericProxyConfig
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow the frontend dev server to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_MODEL = "openrouter/free"


# ---------- request / response models ----------

class SummarizeRequest(BaseModel):
    youtubeUrl: str
    apiKey: str


# ---------- helpers ----------

def parse_summary_json(json_string):
    """Try to extract JSON from the model response, which may contain markdown fences."""
    # Strip markdown code fences if present
    cleaned = re.sub(r"^```(?:json)?\s*", "", json_string.strip())
    cleaned = re.sub(r"\s*```$", "", cleaned)

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print("Error parsing JSON:", e)
        return None

    return data


def extract_video_id(url):
    """Extract the 11-character video ID from a YouTube URL."""
    pattern = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(pattern, url)
    return match.group(1) if match else None


async def generate_summary(transcript_str, api_key):
    """Call OpenRouter to summarize the transcript."""
    prompt = f'''You are a YouTube video summarizer. Given the transcript below, produce a JSON object with EXACTLY these keys (no markdown fences, no extra keys):

{{
  "title": "A clear, concise title for the video",
  "summary": "A detailed 3-5 paragraph summary of the video content",
  "timestamps": [
    {{ "time": "00:00", "label": "Topic discussed at this point" }},
    {{ "time": "02:30", "label": "Next major topic" }}
  ],
  "keyTakeaways": [
    "First key insight or takeaway",
    "Second key insight or takeaway",
    "Third key insight or takeaway"
  ]
}}

Rules:
- Output ONLY valid JSON, no markdown fences, no commentary.
- Translate everything to English.
- Generate 4-8 timestamps spread across the video.
- Generate 3-6 key takeaways.
- The summary should be detailed and capture main arguments and themes.

Transcript:
{transcript_str}
'''

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": DEFAULT_MODEL,
        "messages": [
            {"role": "user", "content": prompt},
        ],
    }

    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(OPENROUTER_API_URL, json=payload, headers=headers)

    if response.status_code == 401:
        raise HTTPException(status_code=401, detail="Invalid OpenRouter API key.")
    if response.status_code == 402:
        raise HTTPException(status_code=402, detail="Insufficient credits on your OpenRouter account.")
    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"OpenRouter error: {response.text}",
        )

    data = response.json()
    content = data["choices"][0]["message"]["content"]
    print("Raw AI response:", content[:500] if content else "<EMPTY>")

    if not content or not content.strip():
        raise HTTPException(status_code=502, detail="The AI model returned an empty response. Please try again.")

    return content


# ---------- routes ----------

@app.get("/")
async def health_check():
    return {"status": "ok"}


@app.post("/summarize")
async def summarize(body: SummarizeRequest):

    video_id = extract_video_id(body.youtubeUrl)
    if not video_id:
        raise HTTPException(status_code=400, detail="Could not extract a valid YouTube video ID from the URL.")

    try:
        proxy_url = os.environ.get("PROXY_URL")
        if proxy_url:
            ytt = YouTubeTranscriptApi(
                proxy_config=GenericProxyConfig(https_url=proxy_url)
            )
        else:
            ytt = YouTubeTranscriptApi()
        # Accept any available language — the LLM will translate to English
        transcript = ytt.fetch(
            video_id,
            languages=[
                "en", "en-GB", "en-US", "hi", "af", "am", "ar", "az", "be",
                "bg", "bn", "bs", "ca", "cs", "cy", "da", "de", "el", "eo",
                "es", "es-419", "et", "eu", "fa", "fi", "fil", "fr", "fr-CA",
                "gl", "gu", "he", "hr", "hu", "hy", "id", "is", "it", "ja",
                "jv", "ka", "kk", "km", "kn", "ko", "lo", "lt", "lv", "ml",
                "mn", "mr", "ms", "my", "ne", "nl", "no", "or", "pa", "pl",
                "pt", "pt-BR", "pt-PT", "ro", "ru", "si", "sk", "sl", "sq",
                "sr", "sv", "sw", "ta", "te", "th", "tr", "uk", "ur", "uz",
                "vi", "zh", "zh-CN", "zh-HK", "zh-TW", "zu",
            ],
        )
        transcript_str = " ".join(snippet.text for snippet in transcript)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not fetch transcript: {e}")

    if not transcript_str.strip():
        raise HTTPException(status_code=400, detail="Empty transcript returned for this video.")

    raw_summary = await generate_summary(transcript_str, body.apiKey)
    parsed = parse_summary_json(raw_summary)

    if parsed is None:
        raise HTTPException(status_code=500, detail="Failed to parse the AI-generated summary. The model may have returned malformed JSON. Please try again.")

    return parsed