"use client";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Logo } from "../brand/logo";
import { LanguageToggleButton } from "../shared/language-toggle-button";
import { ThemeToggleButton } from "../shared/theme-toggle-button";
import { Button } from "../ui/button";
import { DialogOverlay, DialogPortal } from "../ui/dialog";
import { NavAccountButton } from "./nav-account-button";
import { NavDashboardButton } from "./nav-dashboard-button";

export const NavMenu = () => {
  const t = useTranslations();

  return (
    <DialogPortal>
      <DialogOverlay className="bg-chocolate/5" />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className="bg-glass-chocolate brand-text text-popover-foreground data-open:animate-in data-open:slide-in-from-top-2 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-110 fixed top-2 left-1/2 z-50 grid max-h-full w-full max-w-[calc(100%-1rem)] -translate-x-1/2 gap-6 rounded-4xl pb-4 text-4xl shadow-xl outline-none data-closed:duration-100 data-open:duration-200"
      >
        <div className="bg-chocolate border-chocolate-border/20 grid h-16 w-full min-w-fit grid-cols-3 items-center justify-center gap-4 rounded-t-4xl border-x-4 border-t-4 mask-[linear-gradient(to_bottom,black_60%,transparent_100%)] px-4 py-2 [-webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
          <div className="flex flex-row items-center gap-2">
            <DialogPrimitive.Close
              data-slot="dialog-close"
              render={
                <Button
                  variant="outline_fat"
                  size="icon-lg"
                  chocolate="enabled"
                />
              }
            >
              <XIcon />
              <span className="sr-only">{t("sr.dialog")}</span>
            </DialogPrimitive.Close>
          </div>
          <Link
            href="/"
            className="flex flex-row items-center justify-center gap-2"
          >
            <Logo style="shadowed" />
          </Link>
          <div className="flex flex-row items-center justify-end gap-2">
            <NavAccountButton />
          </div>
        </div>
        <div className="flex flex-col gap-2 px-2"></div>
        <div className="flex flex-row justify-between px-8">
          <ThemeToggleButton variant="outline_fat" chocolate="enabled" />
          <NavDashboardButton expanded />
          <LanguageToggleButton variant="outline_fat" chocolate="enabled" />
        </div>
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
};
