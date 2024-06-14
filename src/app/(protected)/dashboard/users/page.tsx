import { useSession } from "next-auth/react";

export default async function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="container">
      users page
      {session?.user.role}
    </div>
  );
}
