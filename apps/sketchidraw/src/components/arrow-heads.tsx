"use client";

import { ArrowTypes } from "@/constants";
import { ArrowSvg, TriangleOutlineSvg, TriangleSvg } from "@/constants/svg";
import { useCanva } from "@/hooks/use-canva-store";
import { cn } from "@/lib/utils";

export const ArrowHeads = () => {
  const { canvaArrowType, onsetCanvaArrowType } = useCanva();

  const onClick = (type: ArrowTypes) => {
    onsetCanvaArrowType(type);
  };

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-on-surface text-[11px] font-normal tracking-tigher">
        Arrowheads
      </h3>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div
            onClick={() => onClick(ArrowTypes.Arrow)}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg rounded-sm cursor-pointer transition duration-100",
              canvaArrowType === ArrowTypes.Arrow &&
                "ring-1 ring-brand-hover bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <ArrowSvg />
          </div>
          <div
            onClick={() => onClick(ArrowTypes.Triangle)}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg rounded-sm cursor-pointer transition duration-100",
              canvaArrowType === ArrowTypes.Triangle &&
                "ring-1 ring-brand-hover bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <TriangleSvg />
          </div>
          <div
            onClick={() => onClick(ArrowTypes.TriangleOutline)}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg rounded-sm cursor-pointer transition duration-100",
              canvaArrowType === ArrowTypes.TriangleOutline &&
                "ring-1 ring-brand-hover bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <TriangleOutlineSvg />
          </div>
        </div>
      </div>
    </div>
  );
};
