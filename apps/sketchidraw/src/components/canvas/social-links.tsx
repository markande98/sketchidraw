"use client";

import { GithubSvg, LinkedIn, SignupSvg, TwitterSvg } from "@/constants/svg";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const onClick = (href?: string) => {
    if (href) {
      router.push(href);
      router.refresh();
    }
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
            {label}
          </h2>
        </div>
      ))}
    </div>
  );
};
