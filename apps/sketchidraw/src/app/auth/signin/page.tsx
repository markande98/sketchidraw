import { CardWrapper } from "@/components/auth/card-wrapper";
import { SignInForm } from "@/components/auth/sigin-form";

export default function SignInPage() {
  return (
    <CardWrapper
      title="Hi there!"
      description="Enter your email to sigin your account"
      backButtonHref="/auth/signup"
      backButtonLabel="Don't have an account? Sign Up"
    >
      <SignInForm />
    </CardWrapper>
  );
}
