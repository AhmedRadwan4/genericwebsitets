import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="container">
      here should be a dashboard <br /> you are an:{session.user.role}
    </div>
  );
}
