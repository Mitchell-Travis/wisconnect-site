// The LAN origin is baked into an explicitly requested mobile-preview build only.
const mobileOrigin = process.env.NEXT_PUBLIC_LAN_ORIGIN || '';

export function localApiAvailable() {
  return typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_BASE_PATH &&
    (window.location.origin === 'http://localhost:3000' || Boolean(mobileOrigin && window.location.origin === mobileOrigin));
}

export function localApiUrl(path: string) {
  if (!localApiAvailable()) throw new Error('This service is available in the local preview only.');
  if (window.location.origin !== 'http://localhost:3000') return path;
  // Keep browser requests same-origin; Next proxies them to the loopback API.
  // Auth stays at /auth so its HttpOnly cookie keeps the correct path.
  return path.startsWith('/auth/') ? path : `/_local_api${path}`;
}

export function requestSignal(parent?: AbortSignal, timeoutMs = 15000) {
  // Older mobile browsers lack AbortSignal.any/timeout. Keep cancellation and
  // timeouts without depending on either static method.
  const controller = new AbortController();
  const abort = () => controller.abort();
  const timer = setTimeout(abort, timeoutMs);
  if (parent?.aborted) abort();
  else parent?.addEventListener('abort', abort, {once: true});
  return {
    signal: controller.signal,
    dispose() {
      clearTimeout(timer);
      parent?.removeEventListener('abort', abort);
    },
  };
}

export function newRequestId() {
  // randomUUID requires a secure context; getRandomValues also works on private HTTP previews.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
