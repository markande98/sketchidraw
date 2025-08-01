"use client";

import { CrossHatchSvg, HachureSvg, SolidSvg } from "@/constants/svg";
import { FillStyle as FILLSTYLE } from "@/constants/color";
import { useCanva } from "@/hooks/use-canva-store";
import { cn } from "@/lib/utils";

export const FillStyle = () => {
  const { canvaFillstyle, onSetCanvaFillstyle } = useCanva();

  const onClick = (fillStyle: FILLSTYLE) => {
    onSetCanvaFillstyle(fillStyle);
  };
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-white text-[11px] font-normal tracking-tigher">
        Fill
      </h3>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div
            onClick={() => onClick(FILLSTYLE.Hachure)}
            className={cn(
              "flex items-center justify-center bg-surface-high h-8 w-8 rounded-sm cursor-pointer transition duration-100",
              canvaFillstyle === FILLSTYLE.Hachure &&
                "ring-1 ring-white bg-[#403e6a]"
            )}
          >
            <HachureSvg />
          </div>
          <div
            onClick={() => onClick(FILLSTYLE.CrossHatch)}
            className={cn(
              "flex items-center justify-center bg-surface-high h-8 w-8 rounded-sm cursor-pointer transition duration-100",
              canvaFillstyle === FILLSTYLE.CrossHatch &&
                "ring-1 ring-white bg-[#403e6a]"
            )}
          >
            <CrossHatchSvg />
          </div>
          <div
            onClick={() => onClick(FILLSTYLE.Solid)}
            className={cn(
              "flex items-center justify-center bg-surface-high h-8 w-8 rounded-sm cursor-pointer transition duration-100",
              canvaFillstyle === FILLSTYLE.Solid &&
                "ring-1 ring-white bg-[#403e6a]"
            )}
          >
            <SolidSvg />
          </div>
        </div>
      </div>
    </div>
  );
};
