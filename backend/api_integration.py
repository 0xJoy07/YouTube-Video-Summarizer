"""
Standalone reference script demonstrating how to call OpenRouter
with the same prompt used by the backend.
"""

import httpx

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
API_KEY = "YOUR_OPENROUTER_API_KEY"
MODEL = "openrouter/free"

transcript_str = "TRANSCRIPT_EXTRACTED_FROM_VIDEO"

prompt = f'''
Given the transcript of a YouTube video and its title, generate a detailed summary of the transcript in JSON format. The summary should capture the main points of the video, focusing on key ideas, themes, or arguments presented. Make sure to translate things in English. Do not use any special characters or like '\\n' like terms.

Use the following JSON structure for the output and dont add "```json```":

    "Title": "Title from the Transcript,"
    "Summary of the Video": "Detailed summary here"

Transcript:
{transcript_str}
'''

response = httpx.post(
    OPENROUTER_API_URL,
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    },
    json={
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}],
    },
    timeout=120,
)

print(response.json()["choices"][0]["message"]["content"])