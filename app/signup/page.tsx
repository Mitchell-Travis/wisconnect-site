import MemberAccess from "../member-access";
export const metadata = { title: "Accept your invitation | WisConnect", robots: { index: false, follow: false }, referrer: "no-referrer" as const };
export default function SignupPage() { return <MemberAccess mode="signup" />; }
