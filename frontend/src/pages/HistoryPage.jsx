import { ExternalLink, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/Button.jsx";
import { SiteShell } from "../components/SiteShell.jsx";
import { getCachedHistory, isHistoryCacheFresh } from "../services/cache.js";
import { getUserHistory } from "../services/api.js";

export function HistoryPage() {
  const [history, setHistory] = useState(() => getCachedHistory({ allowExpired: true }));
  const [status, setStatus] = useState("idle");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;

    async function validateHistory() {
      const cached = getCachedHistory({ allowExpired: true });
      if (cached.length > 0 && isHistoryCacheFresh()) return;

      setStatus("loading");
      try {
        const next = await getUserHistory({ forceRefresh: cached.length === 0 });
        if (active) setHistory(next);
      } catch {
        if (active) setStatus("error");
        return;
      }
      if (active) setStatus("success");
    }

    validateHistory();
    return () => {
      active = false;
    };
  }, []);

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-7xl px-5 pb-16 pt-8 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-hero-sub">Cached summary history</p>
            <h1 className="mt-2 font-headline text-5xl font-semibold">Your summaries</h1>
          </div>
          <div className="text-sm text-hero-sub">
            {status === "loading" ? (
              <span className="inline-flex items-center gap-2">
                <RefreshCw size={15} className="animate-spin" />
                Validating cache
              </span>
            ) : (
              `${history.length} saved ${history.length === 1 ? "video" : "videos"}`
            )}
          </div>
        </div>

        {history.length === 0 ? (
          <div className="rounded-3xl bg-white/[0.035] p-8 text-hero-sub">
            No saved summaries yet. Generate one from the dashboard and it will appear here
            instantly from local cache.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-2xl bg-white/[0.045] ring-1 ring-white/8">
                <img src={item.thumbnail} alt="" className="aspect-video w-full object-cover" />
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-hero-sub">
                    {new Intl.DateTimeFormat("en", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(item.createdAt))}
                  </p>
                  <h2 className="mt-2 line-clamp-2 min-h-[3.5rem] font-headline text-xl font-semibold">
                    {item.title}
                  </h2>
                  <Button
                    variant="heroSecondary"
                    className="mt-5 h-11 w-full px-4 text-sm"
                    onClick={() => setSelected(item)}
                  >
                    View full saved summary
                    <ExternalLink size={16} />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selected ? <HistoryModal summary={selected} onClose={() => setSelected(null)} /> : null}
    </SiteShell>
  );
}

function HistoryModal({ summary, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[86vh] w-full max-w-3xl overflow-auto rounded-3xl bg-[#10051d] p-6 text-foreground shadow-2xl ring-1 ring-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-hero-sub">Saved summary</p>
            <h2 className="mt-1 font-headline text-3xl font-semibold">{summary.title}</h2>
          </div>
          <Button variant="ghost" className="h-10 px-4" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="mt-6 space-y-6">
          <section>
            <h3 className="font-headline text-xl font-semibold">Key takeaways</h3>
            <ul className="mt-3 space-y-2 text-hero-sub">
              {summary.keyTakeaways.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="font-headline text-xl font-semibold">Transcript summary</h3>
            <p className="mt-3 leading-8 text-hero-sub">{summary.summary}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
