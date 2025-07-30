"use client";

import { Tool } from "./tool";
import { tools } from "@/types/tools";
import { useTool } from "@/hooks/use-tool-store";

export const ToolsMenu = () => {
  const { type } = useTool();
  return (
    <div className="flex items-center bg-surface-high/50 p-2 gap-6 rounded-md transition duration-200">
      {tools.map((tool, index) => (
        <Tool
          key={index}
          label={tool.label}
          iconName={tool.iconName}
          index={index + 1}
          isSelected={type === tool.label}
        />
      ))}
    </div>
  );
};
