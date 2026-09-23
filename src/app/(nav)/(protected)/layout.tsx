import { getServerSession } from "@/server/auth/auth-session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function NavProtectedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getServerSession();
  if (!session) {
    return redirect("/sign-up");
  }
  return <>{children}</>;
}
