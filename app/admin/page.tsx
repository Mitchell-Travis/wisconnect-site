import MemberAccess from "../member-access";
export const metadata = { title: "Member invitations | WisConnect", robots: { index: false, follow: false }, referrer: "no-referrer" as const };
export default function AdminPage() { return <MemberAccess mode="admin" />; }
