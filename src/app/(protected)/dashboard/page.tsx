import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return <div>Not authenticated</div>;
  }

  return <div className="container">dashboard{session.user.role}</div>;
}
