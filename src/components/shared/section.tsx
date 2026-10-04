"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useState } from "react";
import { BrandHeading } from "../brand/brand-heading";
import { Button } from "../ui/button";

type SectionProps = {
  children?: ReactNode;
  heading?: string;
  brandheadingEnabled?: boolean;
  rightArrow?: boolean;
  initialExpanded?: boolean;
};

export const Section = ({
  children,
  heading,
  rightArrow,
  brandheadingEnabled,
  initialExpanded = true,
}: SectionProps) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  const caretDown = "M16 24 L32 40 L48 24";
  const caretUp = "M16 40 L32 24 L48 40";

  const handleClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "flex flex-row items-center gap-4",
          rightArrow && "flex-row-reverse justify-between"
        )}
      >
        <Button variant="ghost" size="icon-3xl" onClick={handleClick}>
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

        {brandheadingEnabled ? (
          <BrandHeading text={heading} />
        ) : (
          <h2 className="text-2xl font-bold">{heading}</h2>
        )}
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
