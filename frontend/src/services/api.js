import { getCachedHistory, isHistoryCacheFresh, setCachedHistory } from "./cache.js";
import { createMockSummary } from "../utils/summary.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with ${response.status}`);
  }

  return response.json();
}

export async function summarizeVideo(youtubeUrl, apiKey) {
  try {
    const response = await request("/summarize", {
      method: "POST",
      body: JSON.stringify({ youtubeUrl, apiKey }),
    });
    return response.summary || response.data || response;
  } catch (error) {
    if (!import.meta.env.DEV) throw error;
    await new Promise((resolve) => setTimeout(resolve, 900));
    return createMockSummary(youtubeUrl);
  }
}

export async function getUserHistory({ forceRefresh = false } = {}) {
  const cached = getCachedHistory();
  if (!forceRefresh && cached.length > 0 && isHistoryCacheFresh()) {
    return cached;
  }

  try {
    const response = await request("/history");
    const history = Array.isArray(response)
      ? response
      : response.items || response.history || response.data || [];
    setCachedHistory(history);
    return history;
  } catch (error) {
    const stale = getCachedHistory({ allowExpired: true });
    if (stale.length > 0) return stale;
    throw error;
  }
}

export async function authenticateUser(credentials = {}) {
  return request("/auth", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
