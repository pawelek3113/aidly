import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ReactNode } from "react";

type BrandHeadingProps = {
  children?: ReactNode;
  className?: string;
  text?: string;
};

const brandTextVariants = cva("", {
  variants: {
    variant: {
      default: "brand-text",
    },
    size: {
      gigantic: "text-5xl",
      xlarge: "text-4xl",
      large: "text-2xl",
      medium: "text-lg",
      small: "text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "large",
  },
});

export const BrandHeading = ({
  children,
  text,
  className,
  size,
  variant,
}: BrandHeadingProps & VariantProps<typeof brandTextVariants>) => {
  return (
    <h1 className={cn(brandTextVariants({ variant, size, className }))}>
      {text ? text : children}
    </h1>
  );
};
