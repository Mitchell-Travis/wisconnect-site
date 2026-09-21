"use client";

import { useEffect, useState } from "react";
import Icon from "./feather-icon";
import styles from "./dashboard.module.css";

const key = "wisconnect-dashboard-theme";

export default function ThemeToggle({ onSelect }: { onSelect: () => void }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const system = matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      let saved: string | null = null;
      try { saved = localStorage.getItem(key); } catch { /* The toggle still works when storage is blocked. */ }
      const next = saved === "dark" || (saved !== "light" && system.matches);
      document.documentElement.dataset.dashboardTheme = next ? "dark" : "light";
      setDark(next);
    };
    const onStorage = (event: StorageEvent) => { if (event.key === key || event.key === null) sync(); };
    sync();
    system.addEventListener("change", sync);
    window.addEventListener("storage", onStorage);
    return () => { system.removeEventListener("change", sync); window.removeEventListener("storage", onStorage); };
  }, []);

  return <button className={styles.themeToggle} type="button" role="menuitem" tabIndex={-1} onClick={() => {
    const theme = dark ? "light" : "dark";
    document.documentElement.dataset.dashboardTheme = theme;
    setDark(!dark);
    try { localStorage.setItem(key, theme); } catch { /* Keep the current session usable without persistent storage. */ }
    onSelect();
  }}><Icon kind={dark ? "sun" : "moon"} />{dark ? "Light theme" : "Dark theme"}</button>;
}
