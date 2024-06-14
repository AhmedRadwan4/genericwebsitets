import Footer from "@/components/footer";
import Header from "@/components/header";
import { ReduxProvider } from "@/redux/provider";
import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <>
      <Header />
      <ReduxProvider>{children}</ReduxProvider>
    </>
  );
}
