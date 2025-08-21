"use client";

import { DarkSvg, LightSvg, SystemSvg } from "@/constants/svg";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  const onClick = (selectedTheme: string) => {
    setTheme(selectedTheme);
  };

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xs font-semibold text-on-surface">Theme</h2>

      <div className="flex items-center gap-1 justify-between p-1 rounded-lg border">
        <div
          onClick={() => onClick("light")}
          className={cn(
            "cursor-pointer rounded-md px-2 py-1 text-[#a8a5ff]",
            theme === "light" &&
              "bg-primary border-primary hover:bg-primary-darker hover:border-primary-darker text-surface-lowest transition-colors duration-150"
          )}
        >
          <LightSvg />
        </div>
        <div
          onClick={() => onClick("dark")}
          className={cn(
            "cursor-pointer rounded-md px-2 py-1 text-[#a8a5ff]",
            theme === "dark" &&
              "bg-primary border-primary hover:bg-primary-darker hover:border-primary-darker text-surface-lowest transition-colors duration-150"
          )}
        >
          <DarkSvg />
        </div>
        <div
          onClick={() => onClick("system")}
          className={cn(
            "cursor-pointer rounded-md px-2 py-1 text-[#a8a5ff]",
            theme === "system" &&
              "bg-primary border-primary hover:bg-primary-darker hover:border-primary-darker text-surface-lowest transition-colors duration-150"
          )}
        >
          <SystemSvg />
        </div>
      </div>
    </div>
  );
};
