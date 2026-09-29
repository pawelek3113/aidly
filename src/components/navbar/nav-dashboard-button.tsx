"use client";
import { authClient } from "@/lib/auth-client";
import { ToolboxIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ComponentProps } from "react";
import { LoadingIcon } from "../shared/LoadingIcon";
import { Button } from "../ui/button";

type NavDashboardButtonProps = {
  expanded?: boolean;
} & Omit<ComponentProps<typeof Button>, "render" | "children">;

export const NavDashboardButton = ({
  expanded,
  ...props
}: NavDashboardButtonProps) => {
  const { isPending } = authClient.useSession();
  const t = useTranslations("navbar");

  const content = expanded ? t("dashboard") : <ToolboxIcon weight="fill" />;

  return (
    <Button
      chocolate="enabled"
      disabled={isPending}
      size={expanded ? "lg" : "icon-lg"}
      variant="outline_fat"
      nativeButton={false}
      render={<Link href={"/dashboard"} />}
      {...props}
    >
      {isPending ? <LoadingIcon /> : content}
    </Button>
  );
};
