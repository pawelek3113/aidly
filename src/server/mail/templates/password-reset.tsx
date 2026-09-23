import { Locale } from "@/i18n/locales";
import { createTranslator } from "next-intl";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  pixelBasedPreset,
  Preview,
  Tailwind,
  Text,
} from "react-email";

interface ResetPasswordMailProps {
  url: string;
  token: string;
  locale?: Locale;
}

const ResetPasswordMail = async ({
  url,
  token,
  locale = "en",
}: ResetPasswordMailProps) => {
  const t = createTranslator({
    messages: await import(`../../../../messages/${locale}.json`),
    namespace: "emails.password_reset",
    locale,
  });

  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
      }}
    >
      <Html lang={locale}>
        <Head />
        <Preview>{t("preview")}</Preview>
        <Body
          lang={locale}
          className="bg-background text-foreground mx-auto max-w-lg p-4 text-center font-sans"
        >
          <Container>
            <Container>
              <Heading className="text-6xl leading-1.5">{t("heading")}</Heading>
              <Heading className="text-4xl leading-0 font-extrabold text-[#973c00]">
                {t("subheading")}
              </Heading>
            </Container>

            <Text className="text">{t("context")}</Text>
            <Container>
              <Text className="text-lg">{t("text")}</Text>
              <Button
                className="rounded-3xl bg-[#6f15c2] px-4 py-3 text-white"
                href={url}
              >
                {t("cta")}
              </Button>
              <Text className="pt-4 text-sm text-[#5f5f5f]">{t("info")}</Text>
            </Container>

            <Text className="pt-4 text-sm text-[#5f5f5f]">{t("note")}</Text>
          </Container>

          {/* footer */}
          <Container className="pt-6">
            <Text className="m-0 text-base text-[#8a8a8a]">{t("footer")}</Text>
            <Text className="m-0 text-xl font-extrabold text-[#8a8a8a]">
              aidly
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

ResetPasswordMail.PreviewProps = { locale: "en" };
export default ResetPasswordMail;
