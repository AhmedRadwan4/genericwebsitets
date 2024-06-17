import "./globals.css";
import React from "react";
import Footer from "../components/footer";
import SessionProvider from "../components/SessionProvider/SessionProvider";
import { ThemeModeScript } from "flowbite-react";
import { auth } from "../auth";
import { ToastContainer } from "react-toastify";
import { SubCategoryProvider } from "@/components/admin/SubCategory/SubCategoryProvider";

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
          <SubCategoryProvider>
            <main>{children}</main>

            <div className="">
              <Footer />
            </div>
            <ToastContainer />
          </SubCategoryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
