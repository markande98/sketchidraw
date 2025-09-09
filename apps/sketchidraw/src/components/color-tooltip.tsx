"use client";

import { Edit, Hash } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useCanva } from "@/hooks/use-canva-store";
import { useEffect, useState } from "react";

interface ColorToolTipProps {
  isCanvaBg?: boolean;
  isThemeBg?: boolean;
}

export const ColorToolTip = ({ isCanvaBg, isThemeBg }: ColorToolTipProps) => {
  const {
    canvaBgColor,
    onSetCanvaBgColor,
    canvaStrokeColor,
    onSetCanvaStrokeColor,
    themeColor,
    onSetThemeColor,
  } = useCanva();
  const [color, setColor] = useState(
    isCanvaBg ? canvaBgColor : canvaStrokeColor
  );
  const validateHex = (value: string): boolean => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexValue = "#" + e.target.value;
    setColor(hexValue);
    if (!validateHex(hexValue)) return;
    if (isCanvaBg) {
      onSetCanvaBgColor(hexValue);
      return;
    }
    if (isThemeBg) {
      onSetThemeColor(hexValue);
      return;
    }
    onSetCanvaStrokeColor(hexValue);
  };

  useEffect(() => {
    setColor(
      isThemeBg ? themeColor : isCanvaBg ? canvaBgColor : canvaStrokeColor
    );
  }, [canvaBgColor, canvaStrokeColor, themeColor, isCanvaBg, isThemeBg]);

  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={cn(
            "h-6 w-6 rounded-sm cursor-pointer hover:scale-110 transition duration-200",
            isCanvaBg && canvaBgColor === "transparent" && "opacity-50"
          )}
          style={
            isCanvaBg && canvaBgColor === "transparent"
              ? {
                  backgroundImage: "url('/background-transparent.png')",
                  backgroundColor: "white",
                }
              : {
                  backgroundColor: isThemeBg
                    ? themeColor
                    : isCanvaBg
                      ? canvaBgColor
                      : canvaStrokeColor,
                }
          }
        />
      </PopoverTrigger>
      <PopoverContent
        className="bg-surface-high/50 p-4 max-w-[200px]"
        sideOffset={20}
        side="right"
        showArrow={true}
      >
        <div className="flex flex-col space-y-2">
          <p className="text-[12px] font-normal tracking-tighter">Hex code</p>
          <div className="flex group items-center px-2 border rounded-md gap-1 bg-surface-high/50">
            <Hash size={16} />
            <Input
              className="border-none outline-none ring-0 ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-sm placeholder:tracking-tighter"
              placeholder="color"
              onChange={handleChange}
              value={color.replace("#", "")}
            />
            <Edit size={16} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
