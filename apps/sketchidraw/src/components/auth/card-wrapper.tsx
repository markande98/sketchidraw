import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackButton } from "./back-button";
import { Roboto_Condensed } from "next/font/google";
import { cn } from "@/lib/utils";

const roberto = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400"],
});

interface CardWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
  backButtonHref: string;
  backButtonLabel: string;
}

export const CardWrapper = ({
  children,
  title,
  description,
  backButtonHref,
  backButtonLabel,
}: CardWrapperProps) => {
  return (
    <Card
      className={cn(
        "w-full max-w-[480px] bg-yellow-100 dark:bg-surface-low tracking-wide",
        roberto.className
      )}
    >
      <CardHeader className="flex items-center flex-col">
        <CardTitle className="text-3xl font-bold dark:text-neutral-300">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <div className="relative flex h-7 items-center justify-center gap-2">
        <div className="w-6 border-t border-yellow-800"></div>
        <span className="flex-shrink font-primary text-sm text-yellow-800">
          or
        </span>
        <div className="w-6 border-t border-yellow-800"></div>
      </div>
      <CardFooter className="flex justify-center">
        <BackButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  );
};
