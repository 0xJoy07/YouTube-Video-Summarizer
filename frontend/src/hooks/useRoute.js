import { useEffect, useState } from "react";

const getPath = () => window.location.pathname || "/";

export function navigateTo(path) {
  if (window.location.pathname === path) return;
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function useRoute() {
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const handleRouteChange = () => setPath(getPath());
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  return { path, navigateTo };
}
