import { useMemo } from "react";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { HistoryPage } from "./pages/HistoryPage.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { useRoute } from "./hooks/useRoute.js";

const routes = {
  "/": LandingPage,
  "/dashboard": DashboardPage,
  "/history": HistoryPage,
};

export default function App() {
  const { path } = useRoute();
  const Page = useMemo(() => routes[path] || LandingPage, [path]);

  return <Page />;
}
