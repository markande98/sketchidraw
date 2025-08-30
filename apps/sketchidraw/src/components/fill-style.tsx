"use client";

import { CrossHatchSvg, HachureSvg, SolidSvg } from "@/constants/svg";
import { ClientEvents, FillStyle as FILLSTYLE } from "@/constants/index";
import { useCanva } from "@/hooks/use-canva-store";
import { cn } from "@/lib/utils";
import { Shape } from "@/types/shape";

type FillStyleProps = {
  selectedShapeId: string | null;
  isConnected: boolean;
  shapes: Shape[];
  sendEncryptedMessage: (
    shape: Shape,
    type: ClientEvents,
    toBeAdded: boolean,
    toBeDeleted: boolean
  ) => void;
};

export const FillStyle = ({
  selectedShapeId,
  isConnected,
  shapes,
  sendEncryptedMessage,
}: FillStyleProps) => {
  const { canvaFillstyle, onSetCanvaFillstyle, canvaShapes, onSetCanvaShapes } =
    useCanva();
  let newShapes = isConnected ? shapes : canvaShapes;
  const onClick = (fillStyle: FILLSTYLE) => {
    onSetCanvaFillstyle(fillStyle);
    if (selectedShapeId !== null) {
      let shapeToUpdate = newShapes.find((s) => s.id === selectedShapeId)!;
      shapeToUpdate = {
        ...shapeToUpdate,
        fillStyle,
      };
      if (isConnected) {
        sendEncryptedMessage(
          shapeToUpdate,
          ClientEvents.Encryption,
          true,
          false
        );
      } else {
        newShapes = canvaShapes.map((s) =>
          s.id === selectedShapeId ? shapeToUpdate : s
        );
        onSetCanvaShapes([...newShapes]);
      }
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
            tabIndex={0}
            onClick={(e) => {
              e.currentTarget.focus();
              onClick(FILLSTYLE.Hachure);
            }}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg focus:ring-1 focus:ring-brand-hover  rounded-sm cursor-pointer transition duration-100",
              canvaFillstyle === FILLSTYLE.Hachure &&
                "bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <HachureSvg />
          </div>
          <div
            tabIndex={0}
            onClick={(e) => {
              e.currentTarget.focus();
              onClick(FILLSTYLE.CrossHatch);
            }}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg focus:ring-1 focus:ring-brand-hover rounded-sm cursor-pointer transition duration-100",
              canvaFillstyle === FILLSTYLE.CrossHatch &&
                "bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <CrossHatchSvg />
          </div>
          <div
            tabIndex={0}
            onClick={(e) => {
              e.currentTarget.focus();
              onClick(FILLSTYLE.Solid);
            }}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg focus:ring-1 focus:ring-brand-hover rounded-sm cursor-pointer transition duration-100",
              canvaFillstyle === FILLSTYLE.Solid &&
                "bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <SolidSvg />
          </div>
        </div>
      </div>
    </div>
  );
};
