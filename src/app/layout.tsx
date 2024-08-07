import "./globals.css";
import React from "react";
import Footer from "../components/footer";
import SessionProvider from "../components/SessionProvider/SessionProvider";
import { ThemeModeScript } from "flowbite-react";
import { auth } from "../auth";
import { ToastContainer } from "react-toastify";
import { CategoryProvider } from "@/components/admin/Categories/CategoryProvider";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta property="description" content="Generic E-commerce Website" />
        <meta property="og:image" content="/favicon.ico"></meta>
        <meta property="og:site_name" content="E-commerce Test Website"></meta>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <title>Generic Website</title>
        <ThemeModeScript />
      </head>
      <body className="grid bg-white overflow-x-hidden">
        <SessionProvider session={session}>
          <CategoryProvider>
            <main className="columns-7 h-full flex">{children}</main>
            <div>
              <Footer />
            </div>
            <ToastContainer />
          </CategoryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
