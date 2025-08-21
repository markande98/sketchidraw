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
import { CursorType } from "@/constants";
import { useTheme } from "next-themes";

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
  const { onSelectTooltype, onSetCanvaCursorType } = useCanva();
  const { resolvedTheme } = useTheme();
  const Icon = iconMap[iconName];

  const handleClick = (toolType: ToolType) => {
    onSelectTooltype(toolType);
    if (toolType === ToolType.Eraser) {
      onSetCanvaCursorType(CursorType.None);
    } else if (toolType === ToolType.Grab) {
      onSetCanvaCursorType(CursorType.Grab);
    } else {
      onSetCanvaCursorType(CursorType.Crosshair);
    }
  };

  const isDark = resolvedTheme === "dark";

  return (
    <Tooltip>
      <TooltipTrigger onClick={() => handleClick(toolType)} asChild>
        <div
          className={cn(
            "relative p-2 lg:p-3 cursor-pointer flex items-center justify-center",
            isSelected && "bg-surface-primary-container rounded-sm",
            !isSelected &&
              "hover:rounded-md hover:bg-surface-primary-container/30"
          )}
        >
          {Icon &&
            (toolType === ToolType.Text ? (
              <TextSvg />
            ) : (
              <Icon
                className="h-2 w-2 lg:h-3 lg:w-3"
                fill={isSelected ? (isDark ? "white" : "black") : "transparent"}
              />
            ))}
          <span
            className={cn(
              "absolute opacity-50 right-[4px] bottom-[-1px] lg:right-[6px] text-[6px] lg:text-[10px]",
              isSelected && "opacity-100"
            )}
          >
            {index}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="dark:bg-white bg-black" sideOffset={10}>
        <span>{label}</span>
      </TooltipContent>
    </Tooltip>
  );
};
