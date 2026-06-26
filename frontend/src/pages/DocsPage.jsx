import { SiteShell } from "../components/SiteShell.jsx";

export function DocsPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        <h1 className="font-headline text-4xl font-semibold mb-6">Documentation</h1>
        <div className="space-y-8 text-hero-sub text-lg leading-relaxed">
          
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">Getting Started</h2>
            <p>
              To use Summ AI, you will need a valid OpenRouter API key. We use OpenRouter as a gateway to access the most advanced AI models securely.
            </p>
            <ol className="list-decimal list-inside mt-4 space-y-2 text-base">
              <li>Visit <a href="https://openrouter.ai/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">OpenRouter.ai</a> and create an account.</li>
              <li>Navigate to your account settings and generate a new API key.</li>
              <li>Copy the key (it should start with <code>sk-or-v1-</code>).</li>
              <li>Paste the key into the Summ AI dashboard when prompted.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">Privacy & Security</h2>
            <p>
              Your API key is never sent to our servers. It is kept entirely in your browser's memory and is cleared the moment you refresh the page. We take your privacy seriously.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">Supported Videos</h2>
            <p>
              Currently, Summ AI supports public YouTube videos that have closed captioning (subtitles) enabled. Auto-generated captions are also supported. If a video does not have a transcript available, the summarizer will not be able to process it.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">Caching & History</h2>
            <p>
              When you generate a summary, it is saved locally to your browser's IndexedDB/LocalStorage. You can view your past summaries in the <strong>History</strong> tab. Clearing your browser data will delete these saved summaries.
            </p>
          </div>

        </div>
      </section>
    </SiteShell>
  );
}
