import styles from "./site-icon.module.css";

// Rounded, fine-line site drawings inspired by kolejain.com.
// Bell geometry retained from Feather (MIT: public/licenses/feather.txt).
const icons = {
  home: <><path d="m3 9.5 6-3.4c1.5-.9 2.2-1.3 3-1.3s1.5.4 3 1.3l6 3.4M5 8.5l.5 5.5c.3 2.6.4 3.9 1.2 4.7.9.8 2.2.8 4.8.8h1c2.6 0 3.9 0 4.8-.8.8-.8.9-2.1 1.2-4.7l.5-5.5M9 16.5h6"/></>,
  people: <><circle cx="9" cy="8" r="3.3"/><path d="M3.5 19v-1.5A4.5 4.5 0 0 1 8 13h2a4.5 4.5 0 0 1 4.5 4.5V19M16 5a3.3 3.3 0 0 1 0 6.4M17 14a4.5 4.5 0 0 1 3.5 4.4V19"/></>,
  email: <><rect x="3.5" y="5.5" width="17" height="13" rx="4"/><path d="m4 7 5.8 4.6c1.4 1.1 3 1.1 4.4 0L20 7"/></>,
  business: <><rect x="3.5" y="7.5" width="17" height="12" rx="3.5"/><path d="M8.5 7.5V6A2.5 2.5 0 0 1 11 3.5h2A2.5 2.5 0 0 1 15.5 6v1.5M3.5 12c4.5 3 12.5 3 17 0M12 12.5v3"/></>,
  chart: <><path d="M4 4v12c0 3 1 4 4 4h12M8.5 15v-4M13 15V6M17.5 15V9"/></>,
  shield: <><path d="m12 3.5 7 2.8v5.5c0 4.7-4.8 7.7-7 8.7-2.2-1-7-4-7-8.7V6.3L12 3.5Z"/><path d="m9 11.8 2 2 4-4"/></>,
  wallet: <><rect x="3.5" y="5" width="17" height="14" rx="4"/><path d="M20.5 10.5H16a2.5 2.5 0 0 0 0 5h4.5M16.5 13h.01M7 8h7"/></>,
  folder: <><path d="M3.5 8V7c0-2.1.9-3 3-3h2.2c.9 0 1.5.2 2.1.9L12.5 7h5c2.1 0 3 .9 3 3v7c0 2.1-.9 3-3 3h-11c-2.1 0-3-.9-3-3V8Z"/><path d="M3.5 9h17"/></>,
  help: <><rect x="3.5" y="3.5" width="17" height="17" rx="7"/><path d="M9 9a3 3 0 0 1 5.8 1c0 2-2.8 2-2.8 4M12 17h.01"/></>,
  sidebar: <><path d="m11 8-4 4 4 4m6-8-4 4 4 4"/></>,
  clipboard: <><path d="M8 5H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3h-1M8 12h8M8 16h5"/><rect x="8" y="3" width="8" height="4" rx="2"/></>,
  menu: <path d="M5 6.5h14M5 12h14M5 17.5h14"/>,
  play: <path d="M8 5.5c0-.8.8-1.2 1.5-.8l10 6.4c.7.4.7 1.4 0 1.8l-10 6.4c-.7.4-1.5 0-1.5-.8v-13Z"/>,
  pause: <><rect x="6" y="4.5" width="3" height="15" rx="1.5"/><rect x="15" y="4.5" width="3" height="15" rx="1.5"/></>,
  account: <><circle cx="12" cy="7.5" r="3.5"/><path d="M5 20v-1.5A5.5 5.5 0 0 1 10.5 13h3a5.5 5.5 0 0 1 5.5 5.5V20"/></>,
  arrow: <path d="M4.5 12h15m-6-6 6 6-6 6"/>,
  updates: <><path d="M13 3.5H7A3.5 3.5 0 0 0 3.5 7v10A3.5 3.5 0 0 0 7 20.5h10a3.5 3.5 0 0 0 3.5-3.5V11c0-1-.4-1.8-1-2.5l-4-4c-.7-.6-1.5-1-2.5-1ZM13 3.5V7a3.5 3.5 0 0 0 3.5 3.5h4M8 12h3M8 16h8"/></>,
  settings: <><path d="M10 3.5h4l.8 2.7 2 .9 2.6-.6 2 3.5-1.8 2 .1 2.2 1.7 2-2 3.4-2.6-.5-2 .9-.8 2.5h-4L9.2 20l-2-.9-2.6.5-2-3.4 1.7-2 .1-2.2-1.8-2 2-3.5 2.6.6 2-.9.8-2.7Z" transform="translate(1 0) scale(.92)"/><circle cx="12" cy="12" r="3"/></>,
  logout: <><path d="M10 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h3M10 12h10m-4-4 4 4-4 4"/></>,
  phone: <><rect x="6" y="3" width="12" height="18" rx="4"/><path d="M10 6h4M11 18h2"/></>,
  key: <><circle cx="8" cy="15.5" r="4.5"/><path d="m11.2 12.3 8.3-8.3H21v3l-2 2h-2v2h-2M6.5 16.5h.01"/></>,
  bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
  trash: <><path d="M4 6.5h16M9 6.5V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M6 6.5l.6 11c.1 2 1 3 3 3h4.8c2 0 2.9-1 3-3l.6-11M10 10.5v6M14 10.5v6"/></>,
  chevron: <path d="m9 6 6 6-6 6"/>,
  cart: <><path d="M3 4h2l2.2 11c.3 1.5 1 2 2.5 2h7.6c1.5 0 2.2-.5 2.5-2L21 8H6M9 20h.01M18 20h.01"/></>,
  book: <><path d="M12 7c-2-2-5.5-2.5-8.5-2v14c3-.5 6.5 0 8.5 2 2-2 5.5-2.5 8.5-2V5c-3-.5-6.5 0-8.5 2Zm0 0v14M7 9l2 .5M15 9.5l2-.5"/></>,
  message: <><path d="M8 4h8c3 0 4.5 1.5 4.5 4.5v5c0 3-1.5 4.5-4.5 4.5H9l-5.5 3V8.5C3.5 5.5 5 4 8 4Z"/><path d="M8 9h8M8 13h5"/></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="4"/><path d="M8 3v4M16 3v4M3.5 10h17M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.2 15.2 5.3 5.3"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  moon: <path d="M20 13.5A8.5 8.5 0 1 1 10.5 4 6.5 6.5 0 0 0 20 13.5Z"/>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4m10.6 10.6 1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  external: <path d="M7 17 17 7M7 7h10v10"/>,
  arrowDown: <path d="M12 4.5v15m-6-6 6 6 6-6"/>,
  arrowLeft: <path d="M19.5 12h-15m6-6-6 6 6 6"/>,
  arrowDownRight: <path d="m7 7 10 10M7 17h10V7"/>,
  chevronDown: <path d="m6 9 6 6 6-6"/>,
  minus: <path d="M5 12h14"/>,
  check: <path d="m5 12 4.5 4.5L19 7"/>,
  pin: <><path d="M19 10c0 5-7 10.5-7 10.5S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  rotate: <><path d="M18.5 8A7.5 7.5 0 1 0 19 15M18.5 3.5V8H14"/></>,
  sparkle: <path d="M12 3.5c1.5 5.5 3 7 8.5 8.5-5.5 1.5-7 3-8.5 8.5-1.5-5.5-3-7-8.5-8.5 5.5-1.5 7-3 8.5-8.5Z"/>,
  announcement: <><path d="M9 8.5 18 4v14l-9-4.5H5a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h4Zm0 0v5M5.5 13.5 7 20h3l-1.5-6.5M21 8v6"/></>,
} as const;

export type IconKind = keyof typeof icons;

export default function Icon({ kind, size = 20, className }: { kind: IconKind; size?: number; className?: string }) {
  return <svg className={`${styles.icon} ${className || ""}`} width={size} height={size} data-icon={kind} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" data-workspace-icon="true">{icons[kind]}</svg>;
}
