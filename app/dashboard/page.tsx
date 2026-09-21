import MemberAccess from "../member-access";
export const metadata = { title: "Your account | WisConnect", robots: { index: false, follow: false }, referrer: "no-referrer" as const };
export default function DashboardPage() { return <MemberAccess mode="dashboard" />; }
