"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { MouseEvent, ReactNode, useState } from "react";
import { BrandHeading } from "../brand/brand-heading";
import { Button } from "../ui/button";

type SectionProps = {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  heading?: string;
  brandheadingEnabled?: boolean;
  rightArrow?: boolean;
  nonExpandable?: boolean;
  initialExpanded?: boolean;
  clickable?: boolean;
  headingClassName?: string;
};

export const Section = ({
  children,
  className,
  contentClassName,
  heading,
  nonExpandable,
  rightArrow,
  brandheadingEnabled,
  initialExpanded = true,
  clickable,
  headingClassName,
}: SectionProps) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  const caretDown = "M16 24 L32 40 L48 24";
  const caretUp = "M16 40 L32 24 L48 40";

  const handleClick = (_e: MouseEvent<HTMLElement>) => {
    setExpanded(!expanded);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        {...(clickable && {
          tabIndex: 0,
          onClick: handleClick,
          role: "button",
        })}
        className={cn(
          "flex flex-row items-center gap-4",
          rightArrow && "flex-row-reverse justify-between",
          clickable && "cursor-pointer"
        )}
      >
        {!nonExpandable && (
          <Button
            variant="ghost"
            size="icon-3xl"
            onClick={(e) => {
              e.stopPropagation();
              handleClick(e);
            }}
          >
            <svg
              className="size-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 64 64"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                initial={false}
                animate={{ d: expanded ? caretDown : caretUp }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
              />
            </svg>
          </Button>
        )}

        {brandheadingEnabled ? (
          <BrandHeading text={heading} className={headingClassName} />
        ) : (
          <h2 className={cn("text-2xl font-bold", headingClassName)}>
            {heading}
          </h2>
        )}
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className={cn(
              "flex flex-col gap-2 overflow-hidden",
              contentClassName
            )}
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
