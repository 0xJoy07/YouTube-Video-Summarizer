import { SiteShell } from "../components/SiteShell.jsx";

export function HowItWorksPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        <h1 className="font-headline text-4xl font-semibold mb-6">How it Works</h1>
        <div className="space-y-6 text-hero-sub text-lg leading-relaxed">
          <p>
            Summ AI leverages the power of advanced AI models via OpenRouter to digest long YouTube videos into concise, actionable summaries. Here is how the process works from start to finish:
          </p>
          
          <div className="rounded-2xl bg-white/[0.04] p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-foreground mb-2">1. Video Submission</h2>
            <p>You provide a YouTube video URL. We parse the URL and extract the unique video ID to fetch the transcript from YouTube's closed captioning system.</p>
          </div>

          <div className="rounded-2xl bg-white/[0.04] p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-foreground mb-2">2. Transcript Processing</h2>
            <p>We download the full text of the video, preserving the timestamps. This ensures the AI has all the raw conversational data required to understand the context.</p>
          </div>

          <div className="rounded-2xl bg-white/[0.04] p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-foreground mb-2">3. AI Summarization</h2>
            <p>Using your OpenRouter API key, we securely send the transcript to a powerful language model. The model is instructed to extract key takeaways, divide the content into chronological chapters, and provide a comprehensive overview.</p>
          </div>

          <div className="rounded-2xl bg-white/[0.04] p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-foreground mb-2">4. Review & Save</h2>
            <p>The structured JSON response is formatted and presented to you in the dashboard. Your summary is automatically saved to your local browser history for easy retrieval later.</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
