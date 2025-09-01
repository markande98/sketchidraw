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
import { useEffect, useState } from "react";

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
  iconName: keyof typeof iconMap | "TextSvg";
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
  const [isMounted, setIsMounted] = useState(false);
  const { onSelectTooltype, onSetCanvaCursorType } = useCanva();
  const { resolvedTheme } = useTheme();
  const Icon = iconName !== "TextSvg" ? iconMap[iconName] : null;

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

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  return (
    <Tooltip>
      <TooltipTrigger onClick={() => handleClick(toolType)} asChild>
        <div
          className={cn(
            "relative p-2 sm:p-3 cursor-pointer flex items-center justify-center",
            isSelected && "bg-surface-primary-container rounded-sm",
            !isSelected &&
              "hover:rounded-md hover:bg-surface-primary-container/30"
          )}
        >
          {!Icon && <TextSvg />}
          {Icon && (
            <Icon
              className={`h-2 w-2 sm:h-3 sm:w-3 ${
                isSelected
                  ? resolvedTheme === "dark"
                    ? "fill-white"
                    : "fill-black"
                  : "fill-transparent"
              }`}
            />
          )}
          <span
            className={cn(
              "absolute opacity-50 bottom-[-1px] right-[6px] text-[6px] sm:text-[10px]",
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
