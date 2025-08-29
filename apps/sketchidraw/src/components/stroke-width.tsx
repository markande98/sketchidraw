"use client";

import { STROKE_WIDTH } from "@/constants/index";
import { useCanva } from "@/hooks/use-canva-store";
import { cn } from "@/lib/utils";
import { Minus } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

type StrokeWidthProps = {
  selectedShapeId: string | null;
};

export const StrokeWidth = ({ selectedShapeId }: StrokeWidthProps) => {
  const { resolvedTheme } = useTheme();
  const { onSetCanvaStrokeWidth, canvaShapes, onSetCanvaShapes } = useCanva();
  const [widthIndex, setWidthIndex] = useState(0);

  const onClick = (index: number) => {
    setWidthIndex(index);
    onSetCanvaStrokeWidth(STROKE_WIDTH[index]);
    if (selectedShapeId !== null) {
      let newShapes = canvaShapes;
      let shapeToUpdate = newShapes.find((s) => s.id === selectedShapeId)!;
      shapeToUpdate = {
        ...shapeToUpdate,
        strokeWidth: STROKE_WIDTH[index],
      };
      newShapes = canvaShapes.map((s) =>
        s.id === selectedShapeId ? shapeToUpdate : s
      );
      onSetCanvaShapes([...newShapes]);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-on-surface text-[11px] font-normal tracking-tigher">
        Stroke width
      </h3>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          {STROKE_WIDTH.map((width, index) => (
            <div
              tabIndex={0}
              onClick={(e) => {
                e.currentTarget.focus();
                onClick(index);
              }}
              key={index}
              className={cn(
                "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg focus:ring-1 focus:ring-brand-hover rounded-sm cursor-pointer transition duration-100",
                widthIndex === index &&
                  "bg-surface-primary-container border-surface-primary-container"
              )}
            >
              <Minus
                size={20}
                color={resolvedTheme === "dark" ? "white" : "black"}
                strokeWidth={width + 1 * index}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
