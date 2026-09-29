"use client";
import { authClient } from "@/lib/auth-client";
import { User2Icon } from "lucide-react";
import Link from "next/link";
import { ComponentProps } from "react";
import { LoadingIcon } from "../shared/LoadingIcon";
import { Button } from "../ui/button";

export const NavAccountButton = ({
  ...props
}: Omit<ComponentProps<typeof Button>, "render" | "children">) => {
  const { isPending } = authClient.useSession();

  return (
    <Button
      size="icon-lg"
      variant="outline_fat"
      chocolate="enabled"
      disabled={isPending}
      nativeButton={false}
      render={<Link href={"/account-center"} />}
      {...props}
    >
      {isPending ? <LoadingIcon /> : <User2Icon />}
    </Button>
  );
};
