"use client";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import {
  TooltipContent,
  Tooltip as TooltipShadcn,
  TooltipTrigger,
} from "../ui/tooltip";

type TooltipProps = {
  trigger: ReactNode;
  contentClassName?: string;
  content: ReactNode | string;
};

export const ToolTip = ({
  trigger,
  content,
  contentClassName,
}: TooltipProps) => {
  return (
    <TooltipShadcn>
      <TooltipTrigger>{trigger}</TooltipTrigger>
      <TooltipContent>
        <p className={cn(contentClassName)}>{content}</p>
      </TooltipContent>
    </TooltipShadcn>
  );
};
