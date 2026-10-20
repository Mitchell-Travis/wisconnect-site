import type { View } from "./sections";
import Icon from "./workspace-icon";
import styles from "./dashboard.module.css";

export default function MemberNavigation({ view, onViewChange, onInvite }: {
  view: View; onViewChange: (view: View) => void; onInvite: () => void;
}) {
  return <div className={styles.memberManagementBar}>
    <nav className={styles.memberManagementTabs} aria-label="Member management">
      {([["members", "Directory"], ["applications", "Applications"], ["invitations", "Invitations"]] as const).map(([key, label]) =>
        <button key={key} type="button" aria-current={view === key ? "page" : undefined} onClick={() => onViewChange(key)}>{label}</button>
      )}
    </nav>
    <button className={styles.primaryAction} type="button" onClick={onInvite}><Icon kind="plus"/>Invite member</button>
  </div>;
}
