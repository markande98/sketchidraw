"use client";

import { ClientEvents, STROKE_DASH_OFFSET } from "@/constants/index";
import { useCanva } from "@/hooks/use-canva-store";
import { cn } from "@/lib/utils";
import { Shape } from "@/types/shape";
import { useState } from "react";

type StrokeStyleProps = {
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

export const StrokeStyle = ({
  selectedShapeId,
  isConnected,
  shapes,
  sendEncryptedMessage,
}: StrokeStyleProps) => {
  const { onSetCanvaStrokeDashOffset, canvaShapes, onSetCanvaShapes } =
    useCanva();
  const [strokeDashIndex, setStrokeDashIndex] = useState(0);

  let newShapes = isConnected ? shapes : canvaShapes;

  const onClick = (index: number) => {
    onSetCanvaStrokeDashOffset(STROKE_DASH_OFFSET[index]);
    setStrokeDashIndex(index);
    if (selectedShapeId !== null) {
      let shapeToUpdate = newShapes.find((s) => s.id === selectedShapeId)!;
      shapeToUpdate = {
        ...shapeToUpdate,
        strokeDashOffset: STROKE_DASH_OFFSET[index],
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
        Stroke style
      </h3>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div
            tabIndex={0}
            onClick={(e) => {
              e.currentTarget.focus();
              onClick(0);
            }}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg focus:ring-1 focus:ring-brand-hover rounded-sm cursor-pointer transition duration-100",
              strokeDashIndex === 0 &&
                "bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <D1 />
          </div>
          <div
            tabIndex={0}
            onClick={(e) => {
              e.currentTarget.focus();
              onClick(1);
            }}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg focus:ring-1 focus:ring-brand-hover rounded-sm cursor-pointer transition duration-100",
              strokeDashIndex === 1 &&
                "bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <D2 />
          </div>
          <div
            tabIndex={0}
            onClick={(e) => {
              e.currentTarget.focus();
              onClick(2);
            }}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg focus:ring-1 focus:ring-brand-hover rounded-sm cursor-pointer transition duration-100",
              strokeDashIndex === 2 &&
                "bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <D3 />
          </div>
        </div>
      </div>
    </div>
  );
};

const D1 = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-minus text-black dark:text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 12l14 0" />
    </svg>
  );
};

const D2 = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-line-dashed text-black dark:text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 12h2" />
      <path d="M17 12h2" />
      <path d="M11 12h2" />
    </svg>
  );
};

const D3 = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-line-dotted text-black dark:text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 12v.01" />
      <path d="M8 12v.01" />
      <path d="M12 12v.01" />
      <path d="M16 12v.01" />
      <path d="M20 12v.01" />
    </svg>
  );
};
