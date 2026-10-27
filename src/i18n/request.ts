import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { type Locale } from "./locales";

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale: Locale = (store.get("locale")?.value || "en") as Locale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    now: new Date(),
  };
});
