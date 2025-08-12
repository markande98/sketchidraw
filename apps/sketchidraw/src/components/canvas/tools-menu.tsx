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
        "z-[100] flex items-center bg-surface-high/50 p-1 gap-2 rounded-md transition duration-200"
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
