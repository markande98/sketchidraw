"use client";

import { CrossHatchSvg, HachureSvg, SolidSvg } from "@/constants/svg";
import { FillStyle as FILLSTYLE } from "@/constants/index";
import { useCanva } from "@/hooks/use-canva-store";
import { cn } from "@/lib/utils";

type FillStyleProps = {
  selectedShapeIndex: number | null;
};

export const FillStyle = ({ selectedShapeIndex }: FillStyleProps) => {
  const { canvaFillstyle, onSetCanvaFillstyle, canvaShapes, onSetCanvaShapes } =
    useCanva();

  const onClick = (fillStyle: FILLSTYLE) => {
    onSetCanvaFillstyle(fillStyle);
    if (selectedShapeIndex !== null) {
      const newShapes = canvaShapes;
      let shapeToUpdate = newShapes[selectedShapeIndex];
      shapeToUpdate = {
        ...shapeToUpdate,
        fillStyle,
      };
      newShapes[selectedShapeIndex] = shapeToUpdate;
      onSetCanvaShapes([...newShapes]);
    }
  };
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-on-surface text-[11px] font-normal tracking-tigher">
        Fill
      </h3>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div
            onClick={() => onClick(FILLSTYLE.Hachure)}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg rounded-sm cursor-pointer transition duration-100",
              canvaFillstyle === FILLSTYLE.Hachure &&
                "ring-1 ring-brand-hover bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <HachureSvg />
          </div>
          <div
            onClick={() => onClick(FILLSTYLE.CrossHatch)}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg rounded-sm cursor-pointer transition duration-100",
              canvaFillstyle === FILLSTYLE.CrossHatch &&
                "ring-1 ring-brand-hover bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <CrossHatchSvg />
          </div>
          <div
            onClick={() => onClick(FILLSTYLE.Solid)}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg rounded-sm cursor-pointer transition duration-100",
              canvaFillstyle === FILLSTYLE.Solid &&
                "ring-1 ring-brand-hover bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <SolidSvg />
          </div>
        </div>
      </div>
    </div>
  );
};
