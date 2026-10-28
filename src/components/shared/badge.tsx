import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

type BadgeProps = {
  children?: ReactNode;
  text?: string;
  icon?: ReactNode;
};

const badgeVariants = cva(
  "uppercase inline-flex shrink-0 gap-1 items-center justify-center border border-transparent bg-clip-padding text-sm tracking-tighter font-bold whitespace-nowrap",
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
        icon_sm: "p-1 text-xs",
        sm: "px-1 py-0.5 text-xs",
        icon_md: "p-2",
        md: "px-2 py-1",
        lg: "",
      },
      borderRadius: {
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        "3xl": "rounded-3xl",
        "4xl": "rounded-4xl",
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
      borderRadius: "4xl",
    },
  }
);

const Badge = ({
  className,
  children,
  text,
  icon,
  variant = "default",
  size = "md",
  borderRadius = "4xl",
  chocolate = "none",
  ...props
}: HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof badgeVariants> &
  BadgeProps) => {
  return (
    <p
      data-slot="button"
      className={cn(
        badgeVariants({ variant, size, chocolate, borderRadius, className })
      )}
      {...props}
    >
      {icon ?? icon}
      {text ? text : children}
    </p>
  );
};

export { Badge, badgeVariants };
