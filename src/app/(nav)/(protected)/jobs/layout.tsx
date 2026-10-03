import { JobsNavbar } from "@/components/jobs/jobs-nav";
import { ReactNode } from "react";

export default async function JobsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex h-full grow flex-col items-center px-4 pb-24 md:grid md:grid-cols-[auto_1fr] md:items-start md:gap-16 lg:gap-24 xl:gap-36">
      <JobsNavbar />
      {children}
    </div>
  );
}
