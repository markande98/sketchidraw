"use client";

import { STROKE_WIDTH } from "@/constants/index";
import { useCanva } from "@/hooks/use-canva-store";
import { cn } from "@/lib/utils";
import { Minus } from "lucide-react";
import { useState } from "react";

export const StrokeWidth = () => {
  const { onSetCanvaStrokeWidth } = useCanva();
  const [widthIndex, setWidthIndex] = useState(0);

  const onClick = (index: number) => {
    setWidthIndex(index);
    onSetCanvaStrokeWidth(STROKE_WIDTH[index]);
  };

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-white text-[11px] font-normal tracking-tigher">
        Stroke width
      </h3>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          {STROKE_WIDTH.map((width, index) => (
            <div
              onClick={() => onClick(index)}
              key={index}
              className={cn(
                "flex items-center justify-center bg-surface-high h-8 w-8 rounded-sm cursor-pointer transition duration-100",
                widthIndex === index && "ring-1 ring-white bg-[#403e6a]"
              )}
            >
              <Minus size={20} color="white" strokeWidth={width + 1 * index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
