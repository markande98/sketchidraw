"use client";

import { useState } from "react";
import { Tool } from "./tool";
import { tools, ToolType } from "@/types/tools";

export const ToolsMenu = () => {
  const [toolSelected, setToolSelected] = useState<ToolType | undefined>(
    undefined
  );
  return (
    <div className="flex items-center bg-surface-high/50 p-2 gap-6 rounded-md transition duration-200">
      {tools.map((tool, index) => (
        <Tool
          key={index}
          label={tool.label}
          iconName={tool.iconName}
          index={index + 1}
          isSelected={toolSelected === tool.iconName}
          onClick={(value) => setToolSelected(value)}
        />
      ))}
    </div>
  );
};
