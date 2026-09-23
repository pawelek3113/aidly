import { Navbar } from "@/components/navbar/nav-bar";
import { ReactNode } from "react";

export default async function NavLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
