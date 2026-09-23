"use client";
import { User2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export const NavAccountButton = () => {
  const router = useRouter();

  return (
    <Button
      size="icon-lg"
      variant="outline_fat"
      chocolate="enabled"
      onClick={() => {
        router.push("/sign-up");
      }}
    >
      <User2Icon />
    </Button>
  );
};
