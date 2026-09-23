"use client";
import { authClient } from "@/lib/auth-client";
import { User2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoadingIcon } from "../shared/LoadingIcon";
import { Button } from "../ui/button";

export const NavAccountButton = () => {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const handleClick = () => {
    router.push("/account-center");
  };

  return (
    <Button
      size="icon-lg"
      variant="outline_fat"
      chocolate="enabled"
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending ? <LoadingIcon /> : <User2Icon />}
    </Button>
  );
};
