"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

const bgColors = [
  "#F8FAE5", // light cream
  "#A3C9A8", // soft green
  "#84A9C0", // muted blue
  "#FFD6E0", // pastel pink
  "#F9B572", // warm peach
];

export const BackgroundOptions = () => {
  const [bgColor, setBgColor] = useState(bgColors[0]);

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-white text-[11px] font-normal tracking-tigher">
        Background
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {bgColors.map((color, index) => (
            <div
              key={index}
              className={cn(
                "h-6 w-6 rounded-sm cursor-pointer opacity-30",
                color === bgColor && "ring-2 ring-white"
              )}
              style={{ backgroundColor: color }}
              onClick={() => setBgColor(color)}
            />
          ))}
        </div>
        <div className="w-[1px] h-[20px] bg-surface-high/80" />
        <div
          className="h-6 w-6 rounded-md cursor-pointer"
          style={{ backgroundColor: bgColor }}
        />
      </div>
    </div>
  );
};
