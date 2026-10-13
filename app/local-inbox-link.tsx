'use client';
import { useEffect, useState, type ReactNode } from 'react';

export default function LocalInboxLink({children, className}: {children: ReactNode; className?: string}) {
  const [onMac, setOnMac] = useState(false);
  useEffect(() => setOnMac(window.location.hostname === 'localhost'), []);
  return onMac ? <a className={className} href="http://localhost:8025" target="_blank" rel="noreferrer">{children}</a>
    : <span className={className}>Test emails are in Mailpit on your Mac.</span>;
}
