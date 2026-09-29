"use client";
import { authClient } from "@/lib/auth-client";
import { User2Icon } from "lucide-react";
import { LoadingIcon } from "../shared/LoadingIcon";
import { Button } from "../ui/button";

export const NavAccountButton = () => {
  const { isPending } = authClient.useSession();

  return (
    <Button
      size="icon-lg"
      variant="outline_fat"
      chocolate="enabled"
      disabled={isPending}
    >
      {isPending ? <LoadingIcon /> : <User2Icon />}
    </Button>
  );
};
