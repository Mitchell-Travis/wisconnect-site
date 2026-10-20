import { ApiError, accountAvailable } from "../account-api";
import { localApiUrl, requestSignal } from "../local-api";

export type Report = {
  generated_at: string;
  period: {start: string; end: string};
  applications: {total: number; new: number; reviewing: number; waiting: number};
  inquiries: {total: number; open: number; in_progress: number; closed: number};
  directory: {draft: number; published: number; archived: number};
  directory_activity: {imported: number; created: number; saved: number; publish: number; archive: number; restore: number};
  accounts: {admin_active: number; admin_inactive: number; staff_active: number; staff_inactive: number; member_active: number; member_inactive: number};
  workload: {active: number; due: number; overdue: number; unassigned: number; groups: number;
    rows: {id: number | null; name: string | null; active_account: boolean | null; active: number; due: number}[]};
};

export async function reportCsv(start: string, end: string, signal: AbortSignal): Promise<Blob> {
  if (!accountAvailable()) throw new Error("Reports are available in the local preview only.");
  const pending = requestSignal(signal);
  try {
    const response = await fetch(localApiUrl(`/auth/reports/export?${new URLSearchParams({start, end})}`), {
      signal: pending.signal, credentials: "include", cache: "no-store", referrerPolicy: "no-referrer",
      headers: {"X-WisConnect-Request": "1"},
    });
    if (response.status >= 500) throw new ApiError("The report is unavailable. Try again in a moment.", response.status);
    if (!response.ok) {
      const data = await response.json();
      throw new ApiError(typeof data.detail === "string" ? data.detail : "Could not export this report.", response.status);
    }
    if (!response.headers.get("Content-Type")?.startsWith("text/csv")) throw new Error("Unexpected report format.");
    return await response.blob();
  } catch (error) {
    if (signal.aborted || error instanceof ApiError) throw error;
    throw new Error("The report is unavailable. Try again in a moment.");
  } finally { pending.dispose(); }
}
