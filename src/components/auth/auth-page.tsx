"use client";

import Silk from "@/components/bgs/Silk";
import Link from "next/link";
import { ReactNode } from "react";
import { Logo } from "../brand/logo";

interface AuthPageComponentProps {
  form: ReactNode;
  bg?: ReactNode;
}

export const FORM_CLASSNAME =
  "flex w-full flex-col items-center gap-3 md:justify-center";

export const AuthPageComponent = ({
  form,
  bg = (
    <Silk
      speed={3.6}
      scale={0.7}
      color="#bb4d00"
      noiseIntensity={1.3}
      rotation={0}
    />
  ),
}: AuthPageComponentProps) => {
  return (
    <main className="relative min-h-screen">
      <div className="relative z-10 mx-2 flex min-h-screen items-center justify-center md:mx-0 md:items-stretch md:justify-start">
        <div className="glass flex w-full max-w-xl min-w-3xs flex-col items-center gap-3 rounded-4xl p-4 md:justify-center md:rounded-none md:border-none">
          <Link href="/">
            <Logo size="xlarge" style="shadowed" />
          </Link>
          {form}
        </div>
      </div>
      <div className="fixed inset-0 -z-10">{bg}</div>
    </main>
  );
};
