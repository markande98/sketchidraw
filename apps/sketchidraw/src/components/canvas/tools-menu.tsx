"use client";

import { useCanva } from "@/hooks/use-canva-store";
import { Tool } from "./tool";
import { tools, ToolType } from "@/types/tools";
import { cn } from "@/lib/utils";

export const ToolsMenu = () => {
  const { tooltype } = useCanva();

  const getTooltype = (label: string): ToolType => {
    return (
      Object.values(ToolType).find(
        (type) => type.toLowerCase() === label.toLowerCase()
      ) ?? ToolType.Select
    );
  };

  return (
    <div
      className={cn(
        "absolute w-fit inset-x-0 top-6 mx-auto z-[100] flex items-center shadow-md border border-neutral-200 dark:border-none bg-white dark:bg-surface-low p-1 gap-2 rounded-md transition duration-200"
      )}
    >
      {tools.map((tool, index) => (
        <Tool
          key={index}
          label={tool.label}
          iconName={tool.iconName}
          index={index + 1}
          isSelected={tooltype === getTooltype(tool.label)}
          toolType={getTooltype(tool.label)}
        />
      ))}
    </div>
  );
};
