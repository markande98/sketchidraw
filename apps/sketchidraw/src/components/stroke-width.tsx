"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

const strokeWidth = [0, 1, 2];

export const StrokeWidth = () => {
  const [selectWidth, setSelectWidth] = useState(0);
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-white text-[11px] font-normal tracking-tigher">
        Stroke width
      </h3>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          {strokeWidth.map((width, index) => (
            <div
              onClick={() => setSelectWidth(index)}
              key={index}
              className={cn(
                "flex items-center justify-center bg-surface-high h-8 w-8 rounded-sm cursor-pointer transition duration-100",
                selectWidth === index && "ring-1 ring-white bg-[#403e6a]"
              )}
            >
              <div className={`h-[${width + 0.5}px] w-[10px] bg-white`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
