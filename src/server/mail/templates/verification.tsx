import { Locale } from "@/i18n/locales";
import { createTranslator } from "next-intl";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  pixelBasedPreset,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface VerificationOtpEmailProps {
  otp: string;
  locale?: Locale;
}

const VerificationOtpEmail = async ({
  otp,
  locale = "en",
}: VerificationOtpEmailProps) => {
  const t = createTranslator({
    messages: await import(`../../../../messages/${locale}.json`),
    namespace: "emails.email_verification",
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
        <Preview>{t("preview", { otp })}</Preview>
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
            <Text className="text-lg">{t("text")}</Text>
            <Section className="rounded-full bg-[#e7e5e4] p-4">
              <Text className="text-5xl font-extralight tracking-[12px]">
                {otp}
              </Text>
            </Section>
            <Text className="text-sm text-[#4a4a4a]">
              {t.rich("info", {
                link: (chunks) => (
                  <Link
                    href={`${process.env.APP_DOMAIN}/verify?code=${otp}`}
                    className="font-semibold text-[#6f15c2]"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </Text>
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

VerificationOtpEmail.PreviewProps = { otp: 123456, locale: "en" };
export default VerificationOtpEmail;
