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
import { useCanva } from "@/hooks/use-canva-store";
import { ToolType } from "@/types/tools";
import { TextSvg } from "@/constants/svg";

const iconMap = {
  MousePointer,
  Hand,
  Square,
  Circle,
  Diamond,
  MoveRight,
  Minus,
  Pencil,
  TextSvg,
  Eraser,
};

interface ToolProps {
  label: string;
  iconName: keyof typeof iconMap;
  index: number;
  isSelected: boolean;
  toolType: ToolType;
}

export const Tool = ({
  label,
  iconName,
  index,
  isSelected,
  toolType,
}: ToolProps) => {
  const { onSelectTooltype } = useCanva();
  const Icon = iconMap[iconName];

  const handleClick = (toolType: ToolType) => {
    onSelectTooltype(toolType);
  };

  return (
    <Tooltip>
      <TooltipTrigger onClick={() => handleClick(toolType)} asChild>
        <div
          className={cn(
            "relative p-3 cursor-pointer flex items-center justify-center",
            isSelected && "bg-violet-400/50 rounded-md",
            !isSelected && "hover:rounded-md hover:bg-surface-high"
          )}
        >
          {Icon &&
            (toolType === ToolType.Text ? (
              <TextSvg />
            ) : (
              <Icon size={13} fill={isSelected ? "white" : "transparent"} />
            ))}
          <span className="absolute opacity-50 right-[5px] bottom-[1px] text-[10px]">
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
