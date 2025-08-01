"use client";

import { cn } from "@/lib/utils";
import { ColorToolTip } from "./color-tooltip";
import { BACKGROUND_COLOR } from "@/constants/index";
import { useCanva } from "@/hooks/use-canva-store";

export const BackgroundOptions = () => {
  const { canvaBgColor, onSetCanvaBgColor } = useCanva();

  const onChange = (color: string | "transparent") => {
    onSetCanvaBgColor(color);
  };

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-white text-[11px] font-normal tracking-tigher">
        Background
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {BACKGROUND_COLOR.map((color, index) => (
            <div
              key={index}
              className={cn(
                "h-6 w-6 rounded-sm cursor-pointer opacity-50 hover:scale-100 transition duration-200",
                color === canvaBgColor &&
                  "ring-2 ring-offset-2 ring-offset-pink"
              )}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
            />
          ))}
        </div>
        <div className="w-[1px] h-[20px] bg-surface-high/80" />
        <ColorToolTip color={canvaBgColor} onChange={onChange} />
      </div>
    </div>
  );
};
