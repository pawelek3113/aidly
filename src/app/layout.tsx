import { Providers } from "@/components/providers/providers";
import { ThemeProvider } from "@wrksz/themes/next";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { template: "%s | aidly", default: "aidly" },
  description: "aidly app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-chocolate flex min-h-full flex-col">
        <ThemeProvider
          enableSystem
          attribute="class"
          storage="hybrid"
          defaultTheme="system"
          // disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
