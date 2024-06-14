import "./globals.css";
import React from "react";
import Footer from "../components/footer";
import SessionProvider from "../components/SessionProvider/SessionProvider";
import { ThemeModeScript } from "flowbite-react";
import { auth } from "../auth";
import { ToastContainer } from "react-toastify";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Generic Website</title>
        <ThemeModeScript />
      </head>
      <body className="grid bg-white overflow-x-hidden">
        <SessionProvider session={session}>
          <main>{children}</main>

          <div className="">
            <Footer />
          </div>
          <ToastContainer />
        </SessionProvider>
      </body>
    </html>
  );
}
