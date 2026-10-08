import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

type BadgeProps = {
  children?: ReactNode;
  text?: string;
};

const badgeVariants = cva(
  "uppercase inline-flex shrink-0 items-center justify-center rounded-4xl border border-transparent bg-clip-padding text-sm tracking-tighter font-bold whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border-border bg-background/10 dark:bg-transparent",
        outline_fat:
          "border-border border-4 bg-background/10 dark:bg-transparent",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "",
        destructive:
          "bg-destructive/10 text-destructive dark:bg-destructive/20",
      },
      size: {
        xs: "",
        sm: "",
        md: "px-2 py-1",
        lg: "",
      },
      chocolate: {
        none: "",
        enabled: "bg-chocolate border-chocolate-border hover:bg-input/30",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      chocolate: "none",
    },
  }
);

const Badge = ({
  className,
  children,
  text,
  variant = "default",
  size = "md",
  chocolate = "none",
  ...props
}: HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof badgeVariants> &
  BadgeProps) => {
  return (
    <p
      data-slot="button"
      className={cn(badgeVariants({ variant, size, chocolate, className }))}
      {...props}
    >
      {text ? text : children}
    </p>
  );
};

export { Badge, badgeVariants };
