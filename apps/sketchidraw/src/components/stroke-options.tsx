"use client";

import { cn } from "@/lib/utils";

import { STROKE_DARK_COLORS, STROKE_LIGHT_COLORS } from "@/constants/index";
import { useCanva } from "@/hooks/use-canva-store";
import { useTheme } from "next-themes";
import { ColorToolTip } from "./color-tooltip";

export const StrokeOptions = () => {
  const { resolvedTheme } = useTheme();
  const { canvaStrokeColor, onSetCanvaStrokeColor } = useCanva();

  const onChange = (color: string) => {
    onSetCanvaStrokeColor(color);
  };

  const COLORS =
    resolvedTheme === "dark" ? STROKE_DARK_COLORS : STROKE_LIGHT_COLORS;
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-on-surface text-[11px] font-normal tracking-tigher">
        Stroke
      </h3>
      <div className="w-45">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {COLORS.map((color, index) => (
              <div
                key={index}
                className={cn(
                  "h-6 w-6 rounded-sm cursor-pointer hover:scale-110 transition duration-200",
                  color === canvaStrokeColor &&
                    "ring-1 border border-black ring-blue-400"
                )}
                style={{ backgroundColor: color }}
                onClick={() => onChange(color)}
              />
            ))}
          </div>
          <div className="w-[1px] h-[20px] bg-surface-high/80" />
          <ColorToolTip />
        </div>
      </div>
    </div>
  );
};
