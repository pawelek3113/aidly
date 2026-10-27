import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type LabelProps = {
  children?: ReactNode;
  className?: string;
  text?: string;
};
export const Label = ({ children, text, className }: LabelProps) => {
  return (
    <h2
      className={cn(
        "text-muted-foreground text-sm font-extrabold tracking-tighter uppercase",
        className
      )}
    >
      {text ? text : children}
    </h2>
  );
};
