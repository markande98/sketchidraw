"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

const strokeColors = ["#FF5733", "#33C1FF", "#8DFF33", "#FF33A8", "#FFD133"];

export const StrokeOptions = () => {
  const [strokeColor, setStrokeColor] = useState(strokeColors[0]);

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-white text-[11px] font-normal tracking-tigher">
        Stroke
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {strokeColors.map((color, index) => (
            <div
              key={index}
              className={cn(
                "h-6 w-6 rounded-sm cursor-pointer",
                color === strokeColor && "ring-2 ring-offset-2 ring-offset-pink"
              )}
              style={{ backgroundColor: color }}
              onClick={() => setStrokeColor(color)}
            />
          ))}
        </div>
        <div className="w-[1px] h-[20px] bg-surface-high/80" />
        <div
          className="h-6 w-6 rounded-md cursor-pointer"
          style={{ backgroundColor: strokeColor }}
        />
      </div>
    </div>
  );
};
