"use client";
import { authClient } from "@/lib/auth-client";
import { ToolboxIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LoadingIcon } from "../shared/LoadingIcon";
import { Button } from "../ui/button";

export const NavDashboardButton = ({ expanded }: { expanded?: boolean }) => {
  const router = useRouter();
  const { isPending } = authClient.useSession();
  const t = useTranslations("navbar");

  const content = expanded ? t("dashboard") : <ToolboxIcon weight="fill" />;

  const handleAidRequest = () => {
    router.push("/dashboard");
  };
  return (
    <Button
      chocolate="enabled"
      disabled={isPending}
      size={expanded ? "lg" : "icon-lg"}
      variant="outline_fat"
      onClick={handleAidRequest}
    >
      {isPending ? <LoadingIcon /> : content}
    </Button>
  );
};
