import type { ReactNode } from "react";
import Icon from "./workspace-icon";
import styles from "./dashboard.module.css";

export default function DataState({ state, title, description, children, icon }: {
  state: "loading" | "empty" | "error"; title: string; description?: string; children?: ReactNode; icon?: "people" | "search" | "email";
}) {
  return <div className={styles.dataState} data-state={state} role={state === "error" ? "alert" : "status"} aria-busy={state === "loading" || undefined}>
    {state === "loading" ? <div className={styles.skeletonRows} aria-hidden="true">{[0, 1, 2].map(row => <div key={row}><span /><span /><span /></div>)}</div> : <span className={styles.stateIcon}><Icon kind={state === "error" ? "help" : icon || "folder"} /></span>}
    <h2>{title}</h2>
    {description && <p>{description}</p>}
    {children && <div className={styles.stateActions}>{children}</div>}
  </div>;
}
