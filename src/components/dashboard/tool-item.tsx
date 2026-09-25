"use client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { BrandHeading } from "../brand/brand-heading";

export type Tool = {
  name: string;
  description: string;
  icon: ReactNode;
  href?: string;
  comingSoon?: boolean;
};

type ToolItemProps = {
  className?: string;
} & Tool;

export const ToolItem = ({
  name,
  description,
  icon,
  href,
  comingSoon,
  className,
}: ToolItemProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (comingSoon || !href) {
      return;
    }
    router.push(href);
  };

  return (
    <div
      tabIndex={0}
      onClick={handleClick}
      className={cn(
        "border-chocolate-border flex h-full cursor-pointer flex-col overflow-hidden rounded-4xl border-4 sm:max-w-80",
        "transition duration-300 hover:translate-x-3 hover:opacity-70",
        "w-full shrink-0 grow basis-40",
        comingSoon &&
          "opacity-40 transition-none hover:translate-x-0 hover:opacity-40",
        className
      )}
    >
      <div className="bg-chocolate-border/50 dark:bg-chocolate-border border-chocolate-border flex flex-row items-center justify-between gap-2 px-4 py-3">
        <div className="flex flex-col">
          <BrandHeading text={name} className="text-nowrap" />
          {comingSoon && <BrandHeading text="Coming soon" size="small" />}
        </div>
        {icon}
      </div>
      <div className="px-3 py-2">
        <p className="text-card-foreground line-clamp-4 tracking-tight text-pretty">
          {description}
        </p>
      </div>
    </div>
  );
};
