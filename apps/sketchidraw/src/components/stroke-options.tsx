"use client";

import { cn } from "@/lib/utils";

import { STROKE_COLORS } from "@/constants/color";
import { ColorToolTip } from "./color-tooltip";
import { useCanva } from "@/hooks/use-canva-store";

export const StrokeOptions = () => {
  const { canvaStrokeColor, onSetCanvaStrokeColor } = useCanva();

  const onChange = (color: string) => {
    onSetCanvaStrokeColor(color);
  };
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-white text-[11px] font-normal tracking-tigher">
        Stroke
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {STROKE_COLORS.map((color, index) => (
            <div
              key={index}
              className={cn(
                "h-6 w-6 rounded-sm cursor-pointer hover:scale-110 transition duration-200",
                color === canvaStrokeColor &&
                  "ring-2 ring-offset-2 ring-offset-pink"
              )}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
            />
          ))}
        </div>
        <div className="w-[1px] h-[20px] bg-surface-high/80" />
        <ColorToolTip color={canvaStrokeColor} onChange={onChange} />
      </div>
    </div>
  );
};
