"use client";

import Link from "next/link";
import localFont from "next/font/local";
import { useEffect, useRef, useState } from "react";
import { assetPath } from "./assets";
import Icon from "./site-icon";
import styles from "./account-chrome.module.css";

const announcementFont = localFont({ src: "./fonts/geist-latin.woff2", weight: "100 900", display: "swap" });
const menus = [
  { label: "About", links: [
    { label: "Mission & vision", href: "/#purpose", description: "Connecting Africa and the diaspora." },
    { label: "The cooperative model", href: "/#cooperative-model", description: "Own together. Build for each other." },
    { label: "People, capital & communities", href: "/#about", description: "The belief behind our work." },
  ] },
  { label: "Our people", links: [
    { label: "People behind the businesses", href: "/#member-stories", description: "Meet the people in our cooperative." },
    { label: "Business directory", href: "/#business-directory", description: "Explore member-owned enterprises." },
    { label: "Chicago business sectors", href: "/#businesses", description: "Eight sectors. Shared possibilities." },
  ] },
  { label: "Our work", links: [
    { label: "Our wider connections", href: "/#impact", description: "Across Africa and the diaspora." },
    { label: "Services & support", href: "/#what-we-do", description: "Expertise, commercial space and trade." },
    { label: "Community projects", href: "/#community-projects", description: "Local roots. Lasting connections." },
  ] },
  { label: "Get involved", links: [
    { label: "How to get involved", href: "/#get-involved", description: "Bring what you know." },
    { label: "Membership & partnerships", href: "/join", description: "Find your next step with WisConnect." },
    { label: "Your questions, answered", href: "/#faq", description: "What happens next." },
    { label: "Contact WisConnect", href: "/contact", description: "Start a conversation." },
  ] },
];

export function AccountHeader({ skipTarget = "access-title", skipLabel = "Skip to account access" }: { skipTarget?: string; skipLabel?: string } = {}) {
  const [announcementOpen, setAnnouncementOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const close = () => { setMenuOpen(false); setActiveMenu(null); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) close();
    };
    const breakpoint = window.matchMedia("(max-width: 959px)");
    const onResize = () => close();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerdown", outside);
    breakpoint.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerdown", outside);
      breakpoint.removeEventListener("change", onResize);
    };
  }, []);

  return <>
    <a className={styles.skipLink} href={`#${skipTarget}`} onClick={event => { event.preventDefault(); document.getElementById(skipTarget)?.focus(); }}>{skipLabel}</a>
    <header ref={header} className={styles.header} data-scrolled={scrolled}>
    {announcementOpen && <aside className={`${styles.announcement} ${announcementFont.className}`} aria-label="WisConnect announcement">
      <div className={styles.announcementMessage}>
        <Icon kind="announcement" size={16}/>
        <p className={styles.announcementStatic}>Something powerful is coming. WisConnect launches soon.</p>
        <div className={styles.announcementWindow} aria-hidden="true"><div className={styles.announcementTrack}>
          <span>Something powerful is coming.</span><span>WisConnect launches soon.</span><span>Something powerful is coming.</span>
        </div></div>
      </div>
      <button type="button" aria-label="Dismiss announcement" onClick={() => {
        setAnnouncementOpen(false);
        header.current?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
      }}><Icon kind="close" size={16}/></button>
    </aside>}
    <div onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) close();
    }} onKeyDown={event => {
      if (event.key !== "Escape") return;
      if (activeMenu !== null) { triggers.current[activeMenu]?.focus(); setActiveMenu(null); }
      else if (menuOpen) { close(); menuButton.current?.focus(); }
    }}>
      <div className={styles.bar}>
        <Link className={styles.brand} href="/" aria-label="WisConnect home"><img src={assetPath("logo-nav.webp")} alt="WisConnect" width="480" height="160"/></Link>
        <div className={styles.panel} id="login-navigation" data-open={menuOpen}>
          <nav className={styles.navigation} aria-label="Primary navigation">
            {menus.map((menu, index) => <div className={styles.navItem} key={menu.label}>
              <button ref={element => { triggers.current[index] = element; }} id={`login-nav-trigger-${index}`} type="button" aria-expanded={activeMenu === index} aria-controls={`login-nav-links-${index}`} onClick={() => setActiveMenu(activeMenu === index ? null : index)}>
                {menu.label}<Icon kind="chevronDown" size={16}/>
              </button>
              <div className={styles.dropdown} id={`login-nav-links-${index}`} aria-labelledby={`login-nav-trigger-${index}`} hidden={activeMenu !== index}>
                {menu.links.map(link => <Link href={link.href} key={link.href} onClick={close}><strong>{link.label}</strong><span>{link.description}</span></Link>)}
              </div>
            </div>)}
          </nav>
          <Link className={styles.mobileContact} href="/contact" onClick={close}>Contact WisConnect <Icon kind="arrow" size={16}/></Link>
        </div>
        <Link className={styles.contact} href="/contact">Contact</Link>
        <Link className={styles.join} href="/join">Membership</Link>
        <button ref={menuButton} className={styles.menuToggle} type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="login-navigation" onClick={() => { setMenuOpen(!menuOpen); setActiveMenu(null); }}><Icon kind={menuOpen ? "close" : "menu"} size={24}/></button>
      </div>
    </div>
    </header>
  </>;
}

export function AccountFooter({ showInvitationNote = true }: { showInvitationNote?: boolean } = {}) {
  return <footer className={styles.footer}>
    <div className={styles.footerRow}>
      <details className={styles.language} onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
      }} onKeyDown={event => {
        if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); }
      }}>
        <summary aria-label="Language availability: English"><Icon kind="globe" size={18}/>English<Icon kind="chevronDown" size={14}/></summary>
        <div className={styles.languageOptions}><p>Website language</p><span lang="en">English <Icon kind="check" size={16}/></span><span lang="fr">Français <small lang="en">Awaiting translation</small></span></div>
      </details>
      <nav className={styles.footerLinks} aria-label="Footer navigation">
        <Link href="/terms">Terms & Conditions</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/join">Membership interest</Link>
      </nav>
      <p className={styles.copyright}>© 2026 WisConnect</p>
    </div>
    {showInvitationNote && <p className={styles.invitationNote}>Member access by invitation</p>}
  </footer>;
}
