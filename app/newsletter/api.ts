import { localApiAvailable, localApiUrl, requestSignal } from '../local-api';
export const newsletterAvailable = localApiAvailable;

export async function newsletterRequest(path: string, body: object) {
  if (!newsletterAvailable()) throw new Error('Email signup is not open on this site yet. Please check back soon.');
  let response: Response;
  const pending = requestSignal();
  try {
    try {
      response = await fetch(localApiUrl(`/newsletter/${path}`), {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WisConnect-Request': '1' },
        body: JSON.stringify(body), signal: pending.signal,
      });
    } catch { throw new Error('We couldn’t reach the signup service. Your email is still here—please try again.'); }
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'We couldn’t complete that. Please try again.');
    return data;
  } finally { pending.dispose(); }
}
