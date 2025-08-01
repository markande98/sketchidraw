"use client";

import { useCanva } from "@/hooks/use-canva-store";
import { Tool } from "./tool";
import { tools } from "@/types/tools";
import { Gochi_Hand } from "next/font/google";
import { cn } from "@/lib/utils";

const gochi = Gochi_Hand({
  subsets: ["latin"],
  weight: ["400"],
});

export const ToolsMenu = () => {
  const { tooltype } = useCanva();
  return (
    <div
      className={cn(
        "flex items-center bg-surface-high/50 p-1 gap-6 rounded-md transition duration-200",
        gochi.className
      )}
    >
      {tools.map((tool, index) => (
        <Tool
          key={index}
          label={tool.label}
          iconName={tool.iconName}
          index={index + 1}
          isSelected={tooltype === tool.label}
        />
      ))}
    </div>
  );
};
