import { SiteShell } from "../components/SiteShell.jsx";

export function UseCasesPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        <h1 className="font-headline text-4xl font-semibold mb-6">Use Cases</h1>
        <div className="space-y-6 text-hero-sub text-lg leading-relaxed">
          <p>
            Summ AI is designed to help anyone who consumes long-form video content save time. Here are some of the most common ways our users leverage the tool:
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white/[0.04] p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-foreground mb-2">Students & Educators</h2>
              <p className="text-base">Quickly extract the core concepts, definitions, and key arguments from long lecture recordings and educational documentaries. Create study guides in seconds.</p>
            </div>

            <div className="rounded-2xl bg-white/[0.04] p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-foreground mb-2">Content Creators</h2>
              <p className="text-base">Analyze your competitors' videos to understand their structure, pacing, and key talking points without having to watch hours of content.</p>
            </div>

            <div className="rounded-2xl bg-white/[0.04] p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-foreground mb-2">Researchers & Journalists</h2>
              <p className="text-base">Distill long interviews, press conferences, and town halls into searchable text and bullet points. Find exactly the quotes you need.</p>
            </div>

            <div className="rounded-2xl bg-white/[0.04] p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-foreground mb-2">Busy Professionals</h2>
              <p className="text-base">Catch up on industry podcasts, software tutorials, and keynote presentations while on the go. Get the signal without the noise.</p>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
