import { Toaster } from "@/components/ui/toast";
import { TRPCReactProvider } from "@/trpc/client";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { ServerToastListener } from "../shared/server-toast-listener";
import { TooltipProvider } from "../ui/tooltip";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <TRPCReactProvider>
      <NextIntlClientProvider>
        <Toaster />
        <TooltipProvider>{children}</TooltipProvider>
        <ServerToastListener />
      </NextIntlClientProvider>
    </TRPCReactProvider>
  );
};
