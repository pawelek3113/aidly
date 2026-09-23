import { AuthPageComponent } from "@/components/auth/auth-page";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { getServerSession } from "@/server/auth/auth-session";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify",
};

interface VerifyPageProps {
  searchParams: Promise<{ code?: string }>;
}

const VerifyPage = async (props: VerifyPageProps) => {
  const { code = null } = await props.searchParams;

  const session = await getServerSession();
  return (
    <AuthPageComponent
      form={<VerifyEmailForm email={session!.user.email} code={code} />}
    />
  );
};

export default VerifyPage;
