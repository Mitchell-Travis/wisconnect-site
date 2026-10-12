export function newsletterAvailable() {
  return typeof window !== 'undefined' && window.location.origin === 'http://localhost:3000' && !process.env.NEXT_PUBLIC_BASE_PATH;
}

export async function newsletterRequest(path: string, body: object) {
  if (!newsletterAvailable()) throw new Error('Email signup is not open on this site yet. Please check back soon.');
  let response: Response;
  try {
    response = await fetch(`http://localhost:8001/newsletter/${path}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WisConnect-Request': '1' },
      body: JSON.stringify(body), signal: AbortSignal.timeout(15000),
    });
  } catch { throw new Error('We couldn’t reach the signup service. Your email is still here—please try again.'); }
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'We couldn’t complete that. Please try again.');
  return data;
}
