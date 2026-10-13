import type { ReactNode } from "react";
import { AccountHeader, AccountFooter } from "./account-chrome";
import styles from "./member-access.module.css";

export default function AccountShell({ title, busy = false, children }: { title: string; busy?: boolean; children: ReactNode }) {
  return <div className={`${styles.page} ${styles.loginPage} ${styles.focusedLogin}`}>
    <AccountHeader/>
    <main className={styles.main} aria-labelledby="access-title">
      <div className={styles.content} aria-busy={busy}>
        <h1 id="access-title" tabIndex={-1}>{title}</h1>
        {children}
      </div>
    </main>
    <AccountFooter/>
  </div>;
}
