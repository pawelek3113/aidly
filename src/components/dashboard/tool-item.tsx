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
        "border-chocolate-border/20 flex cursor-pointer flex-row gap-2 rounded-4xl border-4 px-4 py-3",
        "transition duration-300 hover:translate-x-5 hover:opacity-70 sm:max-w-80",
        "w-full shrink-0 grow basis-60 justify-between sm:w-auto",
        comingSoon &&
          "opacity-40 transition-none hover:translate-none hover:opacity-40",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <BrandHeading text={name} />
        {comingSoon && <BrandHeading text="Coming soon" size="small" />}
        <p className="line-clamp-3 truncate tracking-tight text-pretty">
          {description}
        </p>
      </div>
      {icon}
    </div>
  );
};
