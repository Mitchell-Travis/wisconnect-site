"use client";

import { useEffect, useState } from "react";
import Icon from "./workspace-icon";
import styles from "./dashboard.module.css";

const key = "wisconnect-dashboard-theme";

export default function ThemeToggle({ onSelect, menu = true }: { onSelect: () => void; menu?: boolean }) {
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
    const onThemeChange = (event: Event) => {
      const theme = (event as CustomEvent<"light" | "dark">).detail;
      document.documentElement.dataset.dashboardTheme = theme;
      setDark(theme === "dark");
    };
    sync();
    system.addEventListener("change", sync);
    window.addEventListener("storage", onStorage);
    window.addEventListener("wisconnect-theme-change", onThemeChange);
    return () => { system.removeEventListener("change", sync); window.removeEventListener("storage", onStorage); window.removeEventListener("wisconnect-theme-change", onThemeChange); };
  }, []);

  return <button className={styles.themeToggle} type="button" role={menu ? "menuitem" : undefined} tabIndex={menu ? -1 : 0} onClick={() => {
    const theme = dark ? "light" : "dark";
    document.documentElement.dataset.dashboardTheme = theme;
    setDark(!dark);
    try { localStorage.setItem(key, theme); } catch { /* Keep the current session usable without persistent storage. */ }
    window.dispatchEvent(new CustomEvent("wisconnect-theme-change", {detail: theme}));
    onSelect();
  }}><Icon kind={dark ? "sun" : "moon"} />{dark ? "Light theme" : "Dark theme"}</button>;
}
