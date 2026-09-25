import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="mx-auto w-full max-w-400 px-8 sm:px-4">{children}</div>
  );
}
