import { Clock, Home, LayoutDashboard } from "lucide-react";
import { Button } from "./Button.jsx";
import { navigateTo } from "../hooks/useRoute.js";
import logoUrl from "../assets/logo.png";

export function SiteShell({ children }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <button className="flex items-center gap-3" onClick={() => navigateTo("/")}>
          <img src={logoUrl} alt="Summ AI" className="h-8 w-8 rounded-lg" />
          <span className="font-headline text-xl font-semibold">Summ AI</span>
        </button>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" className="h-10 px-3" onClick={() => navigateTo("/")}>
            <Home size={17} />
            <span className="hidden sm:inline">Home</span>
          </Button>
          <Button variant="ghost" className="h-10 px-3" onClick={() => navigateTo("/dashboard")}>
            <LayoutDashboard size={17} />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
          <Button variant="ghost" className="h-10 px-3" onClick={() => navigateTo("/history")}>
            <Clock size={17} />
            <span className="hidden sm:inline">History</span>
          </Button>
        </nav>
      </header>
      {children}
    </main>
  );
}
