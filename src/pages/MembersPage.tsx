import { MemberManagement } from "../components/MemberManagement";

export function MembersPage() {
  // Note: Data fetching is now handled by individual components
  // MemberManagement component will fetch its own data when needed
  return <MemberManagement />;
}
