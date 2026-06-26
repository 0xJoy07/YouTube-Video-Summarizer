import { ArrowRight, CheckCircle2, Clock3, FileText, KeyRound, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/Button.jsx";
import { SiteShell } from "../components/SiteShell.jsx";
import { StatusBlock } from "../components/StatusBlock.jsx";
import { pushSummaryToCache } from "../services/cache.js";
import { summarizeVideo } from "../services/api.js";
import { normalizeSummary } from "../utils/summary.js";

const API_KEY_STORAGE_KEY = "summ-ai:openrouter-key";

function getStoredApiKey() {
  try {
    return sessionStorage.getItem(API_KEY_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function storeApiKey(key) {
  try {
    sessionStorage.setItem(API_KEY_STORAGE_KEY, key);
  } catch {
    /* silently ignore */
  }
}

function clearStoredApiKey() {
  try {
    sessionStorage.removeItem(API_KEY_STORAGE_KEY);
  } catch {
    /* silently ignore */
  }
}

// ---------- API Key Gate ----------

function ApiKeyGate({ onConnect }) {
  const [keyInput, setKeyInput] = useState("");
  const [error, setError] = useState("");

  function handleConnect(e) {
    e.preventDefault();
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setError("Please enter your OpenRouter API key.");
      return;
    }
    if (!trimmed.startsWith("sk-")) {
      setError("OpenRouter API keys typically start with \"sk-\". Please double-check your key.");
      return;
    }
    setError("");
    storeApiKey(trimmed);
    onConnect(trimmed);
  }

  return (
    <SiteShell>
      <section className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center px-5 pb-16 pt-8 text-center">
        <div className="liquid-glass w-full rounded-[2.5rem] p-8 sm:p-10">
          {/* Icon */}
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 ring-1 ring-white/10">
            <KeyRound size={36} className="text-indigo-300" />
          </div>

          <h1 className="font-headline text-3xl font-semibold text-foreground sm:text-4xl">
            Connect your API key
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base leading-7 text-hero-sub">
            Summ AI uses{" "}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 underline underline-offset-2 transition hover:text-indigo-200"
            >
              OpenRouter
            </a>{" "}
            to process video transcripts. Enter your API key below to get started.
          </p>

          <form onSubmit={handleConnect} className="mt-8 space-y-4">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="sk-or-v1-..."
              autoFocus
              className="h-14 w-full rounded-2xl bg-white/[0.06] px-5 text-base text-foreground outline-none ring-1 ring-white/10 transition placeholder:text-foreground/35 focus:ring-indigo-300/70"
            />
            <Button
              type="submit"
              variant="heroSecondary"
              className="h-14 w-full px-6"
            >
              <ShieldCheck size={18} />
              Connect &amp; Start Summarizing
            </Button>
          </form>

          {error && (
            <div className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          <p className="mt-6 text-xs leading-5 text-foreground/40">
            Your key is stored only in this browser tab&rsquo;s session and is never saved to any server.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}

// ---------- Main Dashboard ----------

export function DashboardPage() {
  const [apiKey, setApiKey] = useState(getStoredApiKey);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState(null);

  // Show the key gate if no API key is set
  if (!apiKey) {
    return <ApiKeyGate onConnect={(key) => setApiKey(key)} />;
  }

  function handleDisconnect() {
    clearStoredApiKey();
    setApiKey("");
    setSummary(null);
    setStatus("idle");
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!youtubeUrl.trim()) {
      setStatus("error");
      setMessage("Paste a YouTube link before generating a summary.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await summarizeVideo(youtubeUrl.trim(), apiKey);
      const normalized = normalizeSummary(response, youtubeUrl.trim());
      pushSummaryToCache(normalized);
      setSummary(normalized);
      setStatus("success");
      setMessage("Summary generated and saved to local history.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Could not generate the summary.");
    }
  }

  return (
    <SiteShell>
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 pb-14 pt-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1 text-sm text-hero-sub">
            <Sparkles size={15} />
            AI video digestion workspace
          </p>
          <h1 className="font-headline text-5xl font-semibold leading-tight text-foreground sm:text-6xl">
            Convert a long YouTube video into a usable brief.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-hero-sub">
            Paste a URL to extract chapters, key takeaways, and a transcript-level summary
            that is ready for research, planning, or publishing workflows.
          </p>
        </div>

        <div className={`liquid-glass rounded-[2rem] p-5 sm:p-7 ${status === "loading" ? "animate-glow-pulse" : ""}`}>
          {/* API Key indicator */}
          <div className="mb-4 flex items-center justify-between rounded-xl bg-emerald-400/[0.07] px-4 py-2.5 ring-1 ring-emerald-400/15">
            <span className="inline-flex items-center gap-2 text-sm text-emerald-200">
              <CheckCircle2 size={15} />
              API key connected
              <span className="text-emerald-200/50">
                (…{apiKey.slice(-4)})
              </span>
            </span>
            <button
              onClick={handleDisconnect}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/50 transition hover:text-red-300"
            >
              <LogOut size={13} />
              Disconnect
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-3 block text-sm font-medium text-foreground/70">
                YouTube video URL
              </span>
              <input
                value={youtubeUrl}
                onChange={(event) => setYoutubeUrl(event.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="h-16 w-full rounded-2xl bg-white/[0.06] px-5 text-base text-foreground outline-none ring-1 ring-white/10 transition placeholder:text-foreground/35 focus:ring-indigo-300/70"
              />
            </label>
            <Button
              type="submit"
              variant="heroSecondary"
              disabled={status === "loading"}
              className="h-14 w-full px-6"
            >
              {status === "loading" ? "Generating Summary" : "Generate Summary"}
              <ArrowRight size={18} />
            </Button>
          </form>
          <StatusBlock status={status === "loading" ? "idle" : status} message={message} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 lg:px-8">
        {status === "loading" ? <SummarySkeleton /> : null}
        {summary && status !== "loading" ? <SummaryResult summary={summary} /> : null}
        {!summary && status !== "loading" ? (
          <div className="rounded-3xl border border-white/8 bg-white/[0.025] p-8 text-hero-sub">
            Your generated summary will appear here with timestamps, key takeaways, and a
            full transcript summary.
          </div>
        ) : null}
      </section>
    </SiteShell>
  );
}

// ---------- Skeleton & Result ----------

function SummarySkeleton() {
  return (
    <div className="grid gap-5 rounded-3xl border border-indigo-200/10 bg-white/[0.025] p-6">
      <div className="h-7 w-2/5 animate-pulse rounded-full bg-white/10" />
      <div className="grid gap-3 md:grid-cols-3">
        <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
        <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
        <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full animate-pulse rounded-full bg-white/10" />
        <div className="h-4 w-11/12 animate-pulse rounded-full bg-white/10" />
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-white/10" />
      </div>
    </div>
  );
}

function SummaryResult({ summary }) {
  return (
    <div className="grid gap-6 rounded-3xl border border-white/8 bg-white/[0.025] p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-hero-sub">Generated summary</p>
          <h2 className="mt-1 font-headline text-3xl font-semibold">{summary.title}</h2>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/[0.05] px-3 py-1 text-sm text-hero-sub">
          <Clock3 size={15} />
          {summary.duration}
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.75fr_1fr]">
        <div className="rounded-2xl bg-white/[0.04] p-5">
          <h3 className="mb-4 flex items-center gap-2 font-headline text-xl font-semibold">
            <Clock3 size={18} />
            Timestamps
          </h3>
          <div className="space-y-3">
            {summary.timestamps.map((item) => (
              <div key={`${item.time}-${item.label}`} className="flex gap-3 text-sm">
                <span className="font-semibold text-amber-200">{item.time}</span>
                <span className="text-hero-sub">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.04] p-5">
          <h3 className="mb-4 flex items-center gap-2 font-headline text-xl font-semibold">
            <CheckCircle2 size={18} />
            Key takeaways
          </h3>
          <ul className="space-y-3 text-sm leading-6 text-hero-sub">
            {summary.keyTakeaways.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.04] p-5">
        <h3 className="mb-3 flex items-center gap-2 font-headline text-xl font-semibold">
          <FileText size={18} />
          Full transcript summary
        </h3>
        <p className="leading-8 text-hero-sub">{summary.summary}</p>
      </div>
    </div>
  );
}
