import { localApiAvailable, localApiUrl, requestSignal } from './local-api';
export const accountAvailable = localApiAvailable;

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function accountRequest(path: string, method = "GET", body?: object, signal?: AbortSignal) {
  if (!accountAvailable()) throw new Error("Member access is available in the local preview only.");
  const pending = requestSignal(signal);
  try {
    const response = await fetch(localApiUrl(`/auth${path}`), {
      method, signal: pending.signal, credentials: "include", cache: "no-store", referrerPolicy: "no-referrer",
      headers: { "Content-Type": "application/json", "X-WisConnect-Request": "1" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (response.status >= 500) throw new ApiError("The account service is unavailable. Please try again in a moment.", response.status);
    const data = response.status === 204 ? null : await response.json();
    if (!response.ok) throw new ApiError(data.detail || "Something went wrong. Please try again.", response.status);
    return data;
  } catch (err) {
    if (signal?.aborted || err instanceof ApiError) throw err;
    throw new Error("The account service is unavailable. Please try again in a moment.");
  } finally {
    pending.dispose();
  }
}
