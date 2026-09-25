"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Logo } from "../brand/logo";
import { NavAccountButton } from "../navbar/nav-account-button";
import { NavDashboardButton } from "../navbar/nav-dashboard-button";
import { NavMenu } from "../navbar/nav-menu";
import { LanguageToggleButton } from "../shared/language-toggle-button";
import { ThemeToggleButton } from "../shared/theme-toggle-button";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";

export const Navbar = () => {
  return (
    <nav className="glass-chocolate sticky top-2 z-50 mx-2 mb-4 grid h-16 w-auto min-w-fit grid-cols-3 items-center gap-4 rounded-4xl px-4 py-2 sm:mx-auto sm:w-xl">
      <div className="hidden flex-row items-center gap-2 md:flex">
        <ThemeToggleButton variant="outline_fat" chocolate="enabled" />
        <LanguageToggleButton variant="outline_fat" chocolate="enabled" />
      </div>
      <div className="flex flex-row items-center gap-2 md:hidden">
        <Dialog>
          <DialogTrigger
            render={
              <Button size="icon-lg" variant="outline_fat" chocolate="enabled">
                <Menu />
              </Button>
            }
          />
          <NavMenu />
        </Dialog>
      </div>
      <Link
        href="/"
        className="flex flex-row items-center justify-center gap-2"
      >
        <Logo style="shadowed" />
      </Link>
      <div className="flex flex-row items-center justify-end gap-2">
        <NavDashboardButton />
        <NavAccountButton />
      </div>
    </nav>
  );
};
