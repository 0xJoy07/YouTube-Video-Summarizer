const HISTORY_CACHE_KEY = "summ-ai:summary-history";
const HISTORY_CACHE_TTL_MS = 1000 * 60 * 30;

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function getCachedHistory({ allowExpired = false } = {}) {
  const cached = safeParse(localStorage.getItem(HISTORY_CACHE_KEY), null);
  if (!cached || !Array.isArray(cached.items)) return [];

  const isExpired = Date.now() - cached.savedAt > HISTORY_CACHE_TTL_MS;
  if (isExpired && !allowExpired) return [];

  return cached.items;
}

export function isHistoryCacheFresh() {
  const cached = safeParse(localStorage.getItem(HISTORY_CACHE_KEY), null);
  return Boolean(cached?.savedAt && Date.now() - cached.savedAt <= HISTORY_CACHE_TTL_MS);
}

export function setCachedHistory(items) {
  localStorage.setItem(
    HISTORY_CACHE_KEY,
    JSON.stringify({
      savedAt: Date.now(),
      items,
    }),
  );
}

export function pushSummaryToCache(summary) {
  const current = getCachedHistory({ allowExpired: true });
  const next = [summary, ...current.filter((item) => item.id !== summary.id)];
  setCachedHistory(next);
  return next;
}
