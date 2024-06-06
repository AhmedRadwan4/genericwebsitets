import "./globals.css";
import Footer from "../components/footer";
import Header from "../components/header";
import SessionProvider from "../components/SessionProvider/SessionProvider";
import { ThemeModeScript } from "flowbite-react";
import { auth } from "../auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" className="scroll-smooth ">
      <head>
        <title>Generic Website</title>
        <ThemeModeScript />
      </head>
      <body className="bg-white overflow-x-hidden">
        <SessionProvider session={session}>
          <Header />
          <main className="pt-10">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
