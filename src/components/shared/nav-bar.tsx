"use client";
import { Menu } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Logo } from "../brand/logo";
import { Button } from "../ui/button";
import { createPortal } from "react-dom";

export const Navbar = ({}) => {
  const [menuExpanded, setMenuExpanded] = useState<boolean>(false);

  return (
    <nav className="glass-chocolate sticky top-2 z-50 mx-2 mb-4 grid h-16 w-auto min-w-fit grid-cols-3 items-center gap-4 rounded-4xl px-4 py-2 sm:mx-auto sm:w-xl">
      <div className="flex flex-row items-center gap-2">
        <Button
          size="icon-lg"
          variant="outline_fat"
          chocolate="enabled"
          onClick={() => {
            setMenuExpanded(true);
          }}
        >
          <Menu />
        </Button>
      </div>
      <div className="flex flex-row items-center justify-center gap-2">
        <Logo style="shadowed" />
      </div>
      <div className="flex flex-row items-center justify-end gap-2">
        <Button
          size="lg"
          variant="outline_fat"
          chocolate="enabled"
          onClick={() => {
            redirect("/sign-up");
          }}
        >
          Sign in
        </Button>
      </div>
    </nav>
  );
};
