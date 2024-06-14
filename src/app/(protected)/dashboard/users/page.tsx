import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();
  return (
    <div className="container">
      users page
      {session?.user.role}
    </div>
  );
}
