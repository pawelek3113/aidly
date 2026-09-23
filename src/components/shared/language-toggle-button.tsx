"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { setUserLocale } from "@/i18n/actions";
import { Locale, locales } from "@/i18n/locales";
import { capitalize } from "@/lib/utils";
import { TranslateIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { VariantProps } from "class-variance-authority";

export const LanguageToggleButton = (
  props: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>
) => {
  const t = useTranslations("locale");
  const router = useRouter();

  const handleClick = async (locale: Locale) => {
    await setUserLocale(locale);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="icon" {...props} />}
      >
        <TranslateIcon size={32} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass-chocolate min-w-28">
        <DropdownMenuGroup>
          {locales.map((item) => (
            <DropdownMenuItem key={item} onClick={() => handleClick(item)}>
              {capitalize(t(item))}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
