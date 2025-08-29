"use client";

import { ArrowTypes } from "@/constants";
import { ArrowSvg, TriangleOutlineSvg, TriangleSvg } from "@/constants/svg";
import { useCanva } from "@/hooks/use-canva-store";
import { cn } from "@/lib/utils";
import { ToolType } from "@/types/tools";

type ArrowHeadsProps = {
  selectedShapeId: string | null;
};

export const ArrowHeads = ({ selectedShapeId }: ArrowHeadsProps) => {
  const { canvaArrowType, onsetCanvaArrowType, canvaShapes, onSetCanvaShapes } =
    useCanva();

  const onClick = (type: ArrowTypes) => {
    onsetCanvaArrowType(type);
    if (selectedShapeId !== null) {
      let newShapes = canvaShapes;
      let shapeToUpdate = newShapes.find((s) => s.id === selectedShapeId)!;
      if (shapeToUpdate.type === ToolType.Arrow) {
        shapeToUpdate = {
          ...shapeToUpdate,
          arrowType: type,
        };
      }
      newShapes = canvaShapes.map((s) =>
        s.id === selectedShapeId ? shapeToUpdate : s
      );
      onSetCanvaShapes([...newShapes]);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-on-surface text-[11px] font-normal tracking-tigher">
        Arrowheads
      </h3>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div
            tabIndex={0}
            onClick={(e) => {
              e.currentTarget.focus();
              onClick(ArrowTypes.Arrow);
            }}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg focus:ring-1 focus:ring-brand-hover rounded-sm cursor-pointer transition duration-100",
              canvaArrowType === ArrowTypes.Arrow &&
                "bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <ArrowSvg />
          </div>
          <div
            tabIndex={0}
            onClick={(e) => {
              e.currentTarget.focus();
              onClick(ArrowTypes.Triangle);
            }}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg focus:ring-1 focus:ring-brand-hover rounded-sm cursor-pointer transition duration-100",
              canvaArrowType === ArrowTypes.Triangle &&
                "bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <TriangleSvg />
          </div>
          <div
            tabIndex={0}
            onClick={(e) => {
              e.currentTarget.focus();
              onClick(ArrowTypes.TriangleOutline);
            }}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg focus:ring-1 focus:ring-brand-hover rounded-sm cursor-pointer transition duration-100",
              canvaArrowType === ArrowTypes.TriangleOutline &&
                "bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <TriangleOutlineSvg />
          </div>
        </div>
      </div>
    </div>
  );
};
