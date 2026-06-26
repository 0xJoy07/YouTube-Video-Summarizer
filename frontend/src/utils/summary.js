import { getYouTubeThumbnail, extractYouTubeId } from "./youtube.js";

const fallbackTitles = [
  "AI workflow breakdown",
  "Creator strategy deep dive",
  "Technical tutorial summary",
  "Research discussion recap",
];

export function normalizeSummary(summary, youtubeUrl) {
  const id = summary.id || crypto.randomUUID();
  const createdAt = summary.createdAt || new Date().toISOString();
  const url = summary.youtubeUrl || youtubeUrl;

  return {
    id,
    youtubeUrl: url,
    title: summary.title || `YouTube summary ${extractYouTubeId(url) || id.slice(0, 6)}`,
    thumbnail: summary.thumbnail || getYouTubeThumbnail(url),
    createdAt,
    duration: summary.duration || "12:48",
    timestamps: summary.timestamps || [],
    keyTakeaways: summary.keyTakeaways || summary.takeaways || [],
    summary: summary.summary || summary.fullSummary || "",
  };
}

export function createMockSummary(youtubeUrl) {
  const title = fallbackTitles[Math.floor(Math.random() * fallbackTitles.length)];

  return normalizeSummary(
    {
      youtubeUrl,
      title,
      timestamps: [
        { time: "00:00", label: "Context and core question" },
        { time: "02:18", label: "Main concepts and examples" },
        { time: "06:42", label: "Practical recommendations" },
        { time: "10:15", label: "Closing insight and next steps" },
      ],
      keyTakeaways: [
        "The video centers on turning long-form content into a clear sequence of decisions.",
        "The most useful sections are the examples, tradeoffs, and repeatable process.",
        "Viewers should leave with a short action plan instead of a loose transcript.",
      ],
      summary:
        "This generated development summary mirrors the shape expected from the backend API. It highlights the video's main argument, extracts decision-ready takeaways, and preserves timestamped moments so a viewer can jump directly to the strongest parts of the original content.",
    },
    youtubeUrl,
  );
}
