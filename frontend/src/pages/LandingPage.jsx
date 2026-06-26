import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "../components/Button.jsx";
import { navigateTo } from "../hooks/useRoute.js";
import logoUrl from "../assets/logo.png";

const videoUrl =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4";

const logos = ["TechDigest", "EduSpark", "PodStream", "VlogDaily", "CodeCast", "NewsBite"];

function useVideoFadeLoop(videoRef) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    let animationFrame = 0;
    let replayTimer = 0;

    const updateOpacity = () => {
      if (!video.duration || Number.isNaN(video.duration)) {
        animationFrame = requestAnimationFrame(updateOpacity);
        return;
      }

      const fadeInOpacity = Math.min(video.currentTime / 0.5, 1);
      const timeLeft = video.duration - video.currentTime;
      const fadeOutOpacity = Math.min(timeLeft / 0.5, 1);
      video.style.opacity = String(Math.max(0, Math.min(fadeInOpacity, fadeOutOpacity)));
      animationFrame = requestAnimationFrame(updateOpacity);
    };

    const replay = () => {
      cancelAnimationFrame(animationFrame);
      video.style.opacity = "0";
      replayTimer = window.setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
        animationFrame = requestAnimationFrame(updateOpacity);
      }, 100);
    };

    video.addEventListener("ended", replay);
    video.play().catch(() => {});
    animationFrame = requestAnimationFrame(updateOpacity);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(replayTimer);
      video.removeEventListener("ended", replay);
    };
  }, [videoRef]);
}

function NavButton({ children, onClick, dropdown = false }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/90 transition hover:text-foreground">
      {children}
      {dropdown ? <ChevronDown size={15} strokeWidth={2} /> : null}
    </button>
  );
}

export function LandingPage() {
  const videoRef = useRef(null);
  useVideoFadeLoop(videoRef);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover opacity-0"
        src={videoUrl}
        muted
        playsInline
        preload="auto"
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="w-full px-5 py-5 sm:px-8">
          <nav className="flex items-center justify-between">
            <button onClick={() => navigateTo("/")} aria-label="Summ AI home">
              <img src={logoUrl} alt="Summ AI" className="h-8 w-auto" />
            </button>

            <div className="hidden items-center gap-8 md:flex">
              <NavButton onClick={() => navigateTo("/how-it-works")}>How it Works</NavButton>
              <NavButton onClick={() => navigateTo("/use-cases")}>Use Cases</NavButton>
              <NavButton onClick={() => navigateTo("/docs")}>Docs</NavButton>
            </div>

            <Button
              variant="heroSecondary"
              className="px-4 py-2 text-sm"
              onClick={() => navigateTo("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </nav>
          <div className="mt-[3px] h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
        </header>

        <section className="relative flex flex-1 items-center justify-center overflow-visible px-5 text-center">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[527px] w-[984px] -translate-x-1/2 -translate-y-1/2 bg-gray-950 opacity-90 blur-[82px]" />

          <div className="relative mx-auto flex max-w-[1200px] flex-col items-center">
            <h1 className="hero-title font-headline font-normal leading-[1.02] tracking-[-0.024em] text-foreground">
              Summ{" "}
              <span className="bg-gradient-to-l from-[#6366f1] via-[#a855f7] to-[#fcd34d] bg-clip-text text-transparent">
                AI
              </span>
            </h1>
            <p className="mt-[9px] max-w-md text-lg leading-8 text-hero-sub opacity-80">
              The most powerful AI ever deployed
              <br />
              for YouTube content processing.
            </p>
            <Button
              variant="heroSecondary"
              className="mt-[25px] px-[29px] py-[24px]"
              onClick={() => navigateTo("/dashboard")}
            >
              Start Summarizing
            </Button>
          </div>
        </section>

        <section className="pb-10">
          <div className="mx-auto flex max-w-5xl items-center gap-12 px-5">
            <p className="shrink-0 text-sm leading-5 text-foreground/50">
              <br />
            </p>
            <div className="marquee-window min-w-0 flex-1 overflow-hidden">
              <div className="flex w-max animate-marquee gap-16">
                {[...logos, ...logos].map((name, index) => (
                  <div key={`${name}-${index}`} className="flex items-center gap-3">
                    <span className="liquid-glass grid h-6 w-6 place-items-center rounded-lg text-xs font-semibold">
                      {name[0]}
                    </span>
                    <span className="text-base font-semibold text-foreground">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
