"use client";

import { useState } from "react";
import { sections, SectionKey } from "./sections";
import styles from "./dashboard.module.css";
import Icon from "./workspace-icon";
import Link from "next/link";

export default function SectionPreview({ section }: { section: SectionKey }) {
  const page = sections[section];
  const [filter, setFilter] = useState<string>(page.tabs[0]);

  return <section className={styles.sectionPreview} aria-label={`${page.title} preview`}>
    <div className={styles.sectionFilters} role="group" aria-label={`${page.title} categories`}>
      {page.tabs.map(tab => <button key={tab} type="button" aria-pressed={filter === tab} onClick={() => setFilter(tab)}>{tab}</button>)}
    </div>
    <div className={styles.unavailableSection}>
      <Icon kind={page.icon}/>
      <div><h2>Not available yet</h2><p>{page.description}</p>
      {(section === "businesses" || section === "myBusiness") && <Link className={styles.textButton} href="/#businesses">View the public business showcase<Icon kind="external"/></Link>}</div>
    </div>
    <div className={styles.previewTable}>
      <div className={styles.tableScroll} tabIndex={0} role="region" aria-label={`${filter} planned records`}><table><caption className={styles.visuallyHidden}>{filter} · Planned record fields</caption><thead><tr>{page.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead><tbody><tr><td colSpan={page.columns.length} className={styles.previewEmpty}>Records for this view are not connected.</td></tr></tbody></table></div>
    </div>
  </section>;
}
