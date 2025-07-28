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
}

export const Tool = ({ label, iconName, index }: ToolProps) => {
  const Icon = iconMap[iconName];
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative p-2 cursor-pointer hover:bg-surface-high hover:rounded-md">
          {Icon && <Icon size={13} />}
          <span className="absolute right-0 bottom-0 text-[10px]">{index}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <span>{label}</span>
      </TooltipContent>
    </Tooltip>
  );
};
