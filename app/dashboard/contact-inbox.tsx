"use client";

import { useEffect, useRef, useState } from "react";
import DataState from "./data-state";
import styles from "./dashboard.module.css";

export type Inquiry = { id: number; name: string; email: string; topic: string; message: string; created_at: string; email_status: "pending" | "failed" | "sent"; email_mode: string; email_sent_at: string | null };
export type InquiryPage = { items: Inquiry[]; next_cursor: number | null };

export default function ContactInbox({ loadInquiries, retryInquiryEmail }: {
  loadInquiries: (signal: AbortSignal, before?: number) => Promise<InquiryPage>;
  retryInquiryEmail: (id: number) => Promise<Inquiry>;
}) {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  const [retrying, setRetrying] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [attempt, setAttempt] = useState(0);
  const active = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    active.current = controller;
    setLoading(true); setError(""); setNotice(""); setMore(false); setRetrying(null);
    loadInquiries(controller.signal).then(page => {
      if (!controller.signal.aborted) { setItems(page.items); setCursor(page.next_cursor); }
    }).catch(reason => { if (!controller.signal.aborted) setError(reason.message || "Could not load inquiries."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [loadInquiries, attempt]);

  async function loadMore() {
    const controller = active.current;
    if (!controller || cursor === null || more) return;
    setMore(true); setError("");
    try {
      const page = await loadInquiries(controller.signal, cursor);
      if (!controller.signal.aborted) { setItems(previous => [...previous, ...page.items]); setCursor(page.next_cursor); }
    } catch (reason) {
      if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Could not load more inquiries.");
    } finally { if (!controller.signal.aborted) setMore(false); }
  }

  async function retry(id: number) {
    const controller = active.current;
    if (!controller || retrying !== null) return;
    setRetrying(id); setError(""); setNotice("");
    try {
      const result = await retryInquiryEmail(id);
      if (!controller.signal.aborted) {
        setItems(previous => previous.map(item => item.id === id ? result : item));
        setNotice(result.email_status === "sent" ? (result.email_mode === "local" ? "Notification captured in the local test inbox." : "Notification accepted by the email service.") : "The inquiry is saved, but email delivery is still unavailable. Check the mail service and retry.");
      }
    } catch (reason) { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Could not retry email."); }
    finally { if (!controller.signal.aborted) setRetrying(null); }
  }

  if (loading) return <DataState state="loading" title="Loading inquiries…"/>;
  return <section aria-label="Website contact inquiries">
    <div className={styles.inboxToolbar}><p>Messages submitted through the website’s Contact form.</p><button type="button" className={styles.secondaryAction} disabled={more || retrying !== null} onClick={() => setAttempt(value => value + 1)}>Refresh</button></div>
    {error && <p className={styles.error} role="alert">{error}</p>}
    {notice && <p className={styles.note} role="status">{notice}</p>}
    {!items.length && !error ? <DataState state="empty" title="No inquiries yet" description="New contact submissions will appear here."/> : <div className={styles.inboxList}>
      {items.map(item => <details key={item.id} className={styles.inquiry}>
        <summary><span><strong>{item.name}</strong><span>{item.topic} · #{item.id}</span></span><time dateTime={item.created_at}>{new Date(item.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</time></summary>
        <div className={styles.inquiryBody}>
          <a href={'mailto:' + item.email + '?subject=' + encodeURIComponent('Re: WisConnect — ' + item.topic)}>{item.email}</a>
          <p className={styles.inquiryMessage}>{item.message}</p>
          <div className={styles.inquiryDelivery}><p>{item.email_status === "sent" ? item.email_mode === "local" ? "Email notification: local test inbox" : "Email notification: accepted by email service" : "Saved in dashboard · email notification pending"}</p>{item.email_status !== "sent" && <button className={styles.secondaryAction} type="button" disabled={retrying !== null} onClick={() => retry(item.id)}>{retrying === item.id ? "Retrying…" : "Retry email"}</button>}</div>
        </div>
      </details>)}
    </div>}
    {cursor !== null && <button className={styles.secondaryAction} type="button" disabled={more} onClick={loadMore}>{more ? "Loading…" : "Load older inquiries"}</button>}
  </section>;
}
