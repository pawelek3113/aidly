"use client";

import { useTheme } from "@wrksz/themes/client";
import { Moon, Sun } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { VariantProps } from "class-variance-authority";
import { useTranslations } from "next-intl";

export function ThemeToggleButton(
  props: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>
) {
  const { systemTheme, theme, setTheme } = useTheme();

  const t = useTranslations();

  const toggleTheme = () => {
    const value = theme === "system" ? systemTheme : theme;

    setTheme(value === "light" ? "dark" : "light");
  };

  // TODO: button which will reset the state to "system": setTheme("system")

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} {...props}>
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">{t("sr.theme")}</span>
    </Button>
  );
}
