import { CardWrapper } from "@/components/auth/card-wrapper";
import { SignUpform } from "@/components/auth/signup-form";

export default function SignUpPage() {
  return (
    <CardWrapper
      title="Create an account"
      description="Fill up your details to create your account"
      backButtonHref="/auth/signin"
      backButtonLabel="Already have an account? Sign In"
    >
      <SignUpform />
    </CardWrapper>
  );
}
