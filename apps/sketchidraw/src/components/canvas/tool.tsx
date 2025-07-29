"use client";

import {
  MousePointer,
  Square,
  Circle,
  Diamond,
  Hand,
  MoveRight,
  Minus,
  Pencil,
  Eraser,
} from "lucide-react";

import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { ToolType } from "@/types/tools";

const iconMap = {
  MousePointer,
  Hand,
  Square,
  Circle,
  Diamond,
  MoveRight,
  Minus,
  Pencil,
  Eraser,
};

interface ToolProps {
  label: string;
  iconName: keyof typeof iconMap;
  index: number;
  onClick: (value: ToolType) => void;
  isSelected: boolean;
}

export const Tool = ({
  label,
  iconName,
  index,
  onClick,
  isSelected,
}: ToolProps) => {
  const Icon = iconMap[iconName];

  const handleClick = () => {
    onClick(iconName);
  };

  return (
    <Tooltip>
      <TooltipTrigger onClick={handleClick} asChild>
        <div
          className={cn(
            "relative p-3 cursor-pointer flex items-center justify-center",
            isSelected && "bg-violet-400/50 rounded-md",
            !isSelected && "hover:rounded-md hover:bg-surface-high"
          )}
        >
          {Icon && <Icon size={13} fill={isSelected ? "white" : ""} />}
          <span className="absolute right-[5px] bottom-[1px] text-[10px]">
            {index}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <span>{label}</span>
      </TooltipContent>
    </Tooltip>
  );
};
