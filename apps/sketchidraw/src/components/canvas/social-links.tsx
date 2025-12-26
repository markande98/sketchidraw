"use client";

import { GithubSvg, LinkedIn, SignupSvg, TwitterSvg } from "@/constants/svg";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

const socialLinks = [
  {
    label: "GitHub",
    icon: GithubSvg,
    href: "https://github.com/markande98",
    hasStars: true,
  },
  {
    label: "Follow me",
    icon: TwitterSvg,
    href: "https://x.com/markande_dev",
  },
  {
    label: "LinkedIn",
    icon: LinkedIn,
    href: "https://www.linkedin.com/in/gaurav-tiwari-a8b50a194/",
  },
  { label: "Signup", icon: SignupSvg, href: "/auth/signup" },
];

export const SocialLinks = () => {
  const { currentUser, isAuthenticated } = useCurrentUser();
  const [githubStars, setGithubStars] = useState<null | number>(null);
  const router = useRouter();
  const onClick = async (href: string) => {
    if (href !== "/auth/signup") {
      window.open(href, "_blank");
      return;
    }
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

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/markande98/sketchidraw"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setGithubStars(data.stargazers_count);
      } catch (error) {
        console.log("Failed to fetch github stars! ", error);
      }
    };

    fetchStars();
  }, []);

  return (
    <div className="flex flex-1 flex-col space-y-2">
      {socialLinks.map(({ icon: Icon, label, href, hasStars }, index) => (
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
          {hasStars && (
            <div className="flex items-center gap-2 text-on-surface ml-auto">
              <span className="text-xs text-on-surface font-semibold">
                {githubStars}
              </span>
              <Star size="15" fill="yellow" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
