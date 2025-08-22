"use client";

import { CANVAS_BG_DARK_COLOR, CANVAS_BG_LIGHT_COLOR } from "@/constants";
import { cn } from "@/lib/utils";
import { ColorToolTip } from "../color-tooltip";
import { useCanva } from "@/hooks/use-canva-store";
import { useTheme } from "next-themes";

export const CanvasBgColor = () => {
  const { resolvedTheme } = useTheme();
  const { themeColor, onSetThemeColor } = useCanva();

  const onClick = (color: string) => {
    onSetThemeColor(color);
  };

  const COLORS =
    resolvedTheme === "dark" ? CANVAS_BG_DARK_COLOR : CANVAS_BG_LIGHT_COLOR;
  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-on-surface text-[11px] font-semibold tracking-tigher">
        Canvas background
      </h3>
      <div className="w-50">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center flex-1 justify-between gap-1">
            {COLORS.map((color, index) => (
              <div
                key={index}
                className={cn(
                  "h-6 w-6 rounded-sm cursor-pointer hover:scale-110 transition duration-200",
                  color === themeColor &&
                    "ring-1 border border-black ring-blue-400"
                )}
                style={{ backgroundColor: color }}
                onClick={() => onClick(color)}
              />
            ))}
          </div>
          <div className="w-[1px] h-[20px] bg-surface-high/80" />
          <ColorToolTip isThemeBg />
        </div>
      </div>
    </div>
  );
};
