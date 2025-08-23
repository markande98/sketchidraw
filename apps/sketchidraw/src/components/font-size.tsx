"use client";

import {
  FontExtraLargeSvg,
  FontLargeSvg,
  FontMediumSvg,
  FontSmallSvg,
} from "@/constants/svg";
import { useCanva } from "@/hooks/use-canva-store";
import { FontSize as FONT_SIZE } from "@/constants/index";
import { cn } from "@/lib/utils";
import { ToolType } from "@/types/tools";
import { RefObject } from "react";
import { Text } from "@/types/shape";

type FontSizeProps = {
  selectedShapeIndex: number | null;
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

export const FontSize = ({ selectedShapeIndex, canvasRef }: FontSizeProps) => {
  const { canvaFontSize, canvaShapes, onSetCanvaFontSize, onSetCanvaShapes } =
    useCanva();

  const getTextMetrics = (textObj: Text) => {
    if (!canvasRef.current) return { lines: [], width: 0, height: 0 };

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return { lines: [], width: 0, height: 0 };
    ctx.font = `${textObj.fontSize}px ${textObj.fontFamily}`;
    const lines = textObj.text.split("\n");
    const lineHeight = textObj.fontSize * textObj.lineHeight;
    const measuredLines = lines.map((line) => ({
      text: line,
      width: ctx.measureText(line).width,
      height: lineHeight,
    }));

    const maxWidth = Math.max(...measuredLines.map((l) => l.width));
    const totalHeight = measuredLines.length * lineHeight;

    return {
      lines,
      width: maxWidth,
      height: totalHeight,
      lineHeight,
    };
  };

  const onClick = (fontSize: FONT_SIZE) => {
    onSetCanvaFontSize(fontSize);
    if (selectedShapeIndex !== null) {
      const newShapes = canvaShapes;
      let shapeToUpdate = newShapes[selectedShapeIndex];
      if (shapeToUpdate.type === ToolType.Text) {
        shapeToUpdate = {
          ...shapeToUpdate,
          fontSize,
        };
        const metrics = getTextMetrics(shapeToUpdate);
        const endX = shapeToUpdate.startX + (metrics?.width ?? 0);
        const endY = shapeToUpdate.startY + (metrics?.height ?? 0);
        shapeToUpdate = {
          ...shapeToUpdate,
          endX,
          endY,
        };
      }
      newShapes[selectedShapeIndex] = shapeToUpdate;
      onSetCanvaShapes([...newShapes]);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-on-surface text-[11px] font-normal tracking-tigher">
        Font size
      </h3>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div
            onClick={() => onClick(FONT_SIZE.Small)}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg rounded-sm cursor-pointer transition duration-100",
              canvaFontSize === FONT_SIZE.Small &&
                "ring-1 ring-brand-hover bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <FontSmallSvg />
          </div>
          <div
            onClick={() => onClick(FONT_SIZE.Medium)}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg rounded-sm cursor-pointer transition duration-100",
              canvaFontSize === FONT_SIZE.Medium &&
                "ring-1 ring-brand-hover bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <FontMediumSvg />
          </div>
          <div
            onClick={() => onClick(FONT_SIZE.Large)}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg rounded-sm cursor-pointer transition duration-100",
              canvaFontSize === FONT_SIZE.Large &&
                "ring-1 ring-brand-hover bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <FontLargeSvg />
          </div>
          <div
            onClick={() => onClick(FONT_SIZE.Extralarge)}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg rounded-sm cursor-pointer transition duration-100",
              canvaFontSize === FONT_SIZE.Extralarge &&
                "ring-1 ring-brand-hover bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <FontExtraLargeSvg />
          </div>
        </div>
      </div>
    </div>
  );
};
