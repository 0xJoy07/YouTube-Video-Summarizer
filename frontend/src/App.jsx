import { useMemo } from "react";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { HistoryPage } from "./pages/HistoryPage.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { HowItWorksPage } from "./pages/HowItWorksPage.jsx";
import { UseCasesPage } from "./pages/UseCasesPage.jsx";
import { DocsPage } from "./pages/DocsPage.jsx";
import { useRoute } from "./hooks/useRoute.js";

const routes = {
  "/": LandingPage,
  "/dashboard": DashboardPage,
  "/history": HistoryPage,
  "/how-it-works": HowItWorksPage,
  "/use-cases": UseCasesPage,
  "/docs": DocsPage,
};

export default function App() {
  const { path } = useRoute();
  const Page = useMemo(() => routes[path] || LandingPage, [path]);

  return <Page />;
}
