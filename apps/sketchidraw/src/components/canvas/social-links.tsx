"use client";

import { GithubSvg, LinkedIn, SignupSvg, TwitterSvg } from "@/constants/svg";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const socialLinks = [
  {
    label: "GitHub",
    icon: GithubSvg,
  },
  {
    label: "Follow me",
    icon: TwitterSvg,
  },
  {
    label: "LinkedIn",
    icon: LinkedIn,
  },
  { label: "Signup", icon: SignupSvg, href: "/auth/signup" },
];

export const SocialLinks = () => {
  const { currentUser, isAuthenticated } = useCurrentUser();
  const router = useRouter();
  const onClick = async (href?: string) => {
    if (isAuthenticated) {
      await signOut({
        callbackUrl: "/auth/signin",
      });
      return;
    }
    if (href) {
      router.push(href);
    }
  };
  const getDisplayLabel = (originalLabel: string) => {
    if (originalLabel === "Signup") {
      return currentUser ? "Signout" : "Signup";
    }
    return originalLabel;
  };

  return (
    <div className="flex flex-1 flex-col space-y-2">
      {socialLinks.map(({ icon: Icon, label, href }, index) => (
        <div
          onClick={() => onClick(href)}
          key={index}
          className="flex items-center gap-2 cursor-pointer rounded-md p-2 hover:bg-surface-primary-container/50 dark:hover:bg-surface-high transition duration-150"
        >
          <div className={cn(label === "Signup" && "text-promo")}>
            <Icon />
          </div>
          <h2
            className={cn(
              "text-xs font-extrabold text-on-surface",
              label === "Signup" && "text-promo"
            )}
          >
            {getDisplayLabel(label)}
          </h2>
        </div>
      ))}
    </div>
  );
};
