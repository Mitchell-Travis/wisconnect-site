"use client";

import { useState } from "react";
import { sections, SectionKey } from "./sections";
import styles from "./dashboard.module.css";
import DataState from "./data-state";

export default function SectionPreview({ section }: { section: SectionKey }) {
  const page = sections[section];
  const [filter, setFilter] = useState<string>(page.tabs[0]);

  return <section className={styles.sectionPreview} aria-label={`${page.title} preview`}>
    <div className={styles.previewIntro}>
      <span className={styles.tag}>UI preview</span>
      <p>{page.description}</p>
    </div>
    <div className={styles.sectionFilters} role="group" aria-label={`${page.title} categories`}>
      {page.tabs.map(tab => <button key={tab} type="button" aria-pressed={filter === tab} onClick={() => setFilter(tab)}>{tab}</button>)}
    </div>
    <div className={styles.previewTable}>
      <div className={styles.tableScroll} tabIndex={0} role="region" aria-label={`${filter} records`}>
        <table>
          <caption>{page.title} · {filter}</caption>
          <thead><tr>{page.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
          <tbody />
        </table>
      </div>
      <DataState state="empty" title={filter} description="Layout preview — records and actions are not connected yet." />
    </div>
  </section>;
}
