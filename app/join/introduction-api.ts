import { localApiUrl, requestSignal } from '../local-api';
import { accountAvailable, ApiError } from '../account-api';

export async function submitIntroduction(body: object) {
  if (!accountAvailable()) throw new Error('Use the email option to send your introduction.');
  const pending = requestSignal();
  try {
    const response = await fetch(localApiUrl('/introductions'), {
      method: 'POST', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer',
      signal: pending.signal,
      headers: {'Content-Type': 'application/json', 'X-WisConnect-Request': '1'}, body: JSON.stringify(body),
    });
    if (response.status >= 500) throw new Error('Could not confirm receipt.');
    const data = await response.json();
    if (!response.ok) throw new ApiError(data.detail || 'Could not save your introduction. Please try again.', response.status);
    return data as {received: boolean; reference: number};
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error('We could not confirm receipt. Your answers are still here; try again to check and save them safely.');
  } finally { pending.dispose(); }
}
