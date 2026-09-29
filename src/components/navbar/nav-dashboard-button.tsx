"use client";
import { authClient } from "@/lib/auth-client";
import { ToolboxIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { LoadingIcon } from "../shared/LoadingIcon";
import { Button } from "../ui/button";

type NavDashboardButtonProps = {
  expanded?: boolean;
};

export const NavDashboardButton = ({ expanded }: NavDashboardButtonProps) => {
  const { isPending } = authClient.useSession();
  const t = useTranslations("navbar");

  const content = expanded ? t("dashboard") : <ToolboxIcon weight="fill" />;

  return (
    <Button
      chocolate="enabled"
      disabled={isPending}
      size={expanded ? "lg" : "icon-lg"}
      variant="outline_fat"
    >
      {isPending ? <LoadingIcon /> : content}
    </Button>
  );
};
