"use client";
import {
  ChartLineUpIcon,
  MailboxIcon,
  NoteIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "../ui/button";

export const JobsNavbar = () => {
  return (
    <aside className="glass-chocolate fixed inset-x-2 bottom-2 z-50 mx-auto flex max-w-96 min-w-fit items-center justify-around gap-2 rounded-4xl px-4 py-2 md:static md:inset-x-auto md:bottom-0 md:mx-0 md:mt-0 md:min-h-40 md:w-auto md:flex-col md:px-2 md:py-4">
      <Button
        size="icon-lg"
        variant="outline_fat"
        chocolate="enabled"
        nativeButton={false}
        render={<Link href="/jobs" />}
      >
        <NoteIcon weight="fill" />
      </Button>
      <Button
        size="icon-lg"
        variant="outline_fat"
        chocolate="enabled"
        nativeButton={false}
        render={<Link href="/jobs/graph" />}
      >
        <ChartLineUpIcon weight="bold" />
      </Button>
      <Button
        size="icon-lg"
        variant="outline_fat"
        chocolate="enabled"
        nativeButton={false}
        render={<Link href="/jobs/offers" />}
      >
        <MailboxIcon weight="fill" />
      </Button>
      <Button
        size="icon-lg"
        variant="default"
        nativeButton={false}
        render={<Link href="/jobs/create" />}
        className="md:mt-5"
      >
        <PlusIcon weight="bold" />
      </Button>
    </aside>
  );
};
