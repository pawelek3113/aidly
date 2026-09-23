import { Logo } from "@/components/brand/logo";
import { LanguageToggleButton } from "@/components/shared/language-toggle-button";
import { SignOutButton } from "@/components/shared/TEST-ONLY-sign-out-button";
import { ThemeToggleButton } from "@/components/shared/theme-toggle-button";
import { ClientGreeting } from "@/components/shared/trpc-test";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex w-full flex-1 flex-col items-center gap-4">
      <ClientGreeting />
      <LanguageToggleButton />
      <ThemeToggleButton />

      {/* TODO: remove */}
      <Link href="/sign-up">sign up</Link>
      <Link href="/sign-in">sign in</Link>
      <SignOutButton />
      <Logo />
      <Logo size="default" color="brand" style="shadowed" />
      <Logo size="default" color="mono" />
      <Logo size="small" color="white" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
      <Logo size="small" color="black" />
    </main>
  );
}
