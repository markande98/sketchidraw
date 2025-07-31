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
import { useCanva } from "@/hooks/use-canva-store";

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
  label: ToolType;
  iconName: keyof typeof iconMap;
  index: number;
  isSelected: boolean;
}

export const Tool = ({ label, iconName, index, isSelected }: ToolProps) => {
  const { onSelectTooltype } = useCanva();
  const Icon = iconMap[iconName];

  const handleClick = () => {
    onSelectTooltype(label);
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
          {Icon && (
            <Icon size={13} fill={isSelected ? "white" : "transparent"} />
          )}
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
