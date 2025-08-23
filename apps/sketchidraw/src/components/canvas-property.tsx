"use client";

import { useMediaQuery } from "use-media-query-react";

import { useCanva } from "@/hooks/use-canva-store";
import { BackgroundOptions } from "./background-options";
import { EdgeStyle } from "./edge.style";
import { FillStyle } from "./fill-style";
import { Sloppiness } from "./sloppiness";
import { StrokeOptions } from "./stroke-options";
import { StrokeStyle } from "./stroke-style";
import { StrokeWidth } from "./stroke-width";
import { ScrollArea } from "./ui/scroll-area";
import { ToolType } from "@/types/tools";
import { ArrowHeads } from "./arrow-heads";
import { FontSize } from "./font-size";
import { FontFamily } from "./font-family";

type CanvasPropertyProps = {
  selectedShapeIndex: number | null;
};

export const CanvasProperty = ({ selectedShapeIndex }: CanvasPropertyProps) => {
  const isMobile = useMediaQuery("(max-width: 639px)");
  const { tooltype } = useCanva();

  const isEllipseTool = tooltype === ToolType.Ellipse;
  const isArrowTool = tooltype === ToolType.Arrow;
  const isPencilTool = tooltype === ToolType.Pencil;
  const isSelectAndGrab =
    tooltype === ToolType.Grab || tooltype === ToolType.Select;
  const isTextTool = tooltype === ToolType.Text;
  const isEraserTool = tooltype === ToolType.Eraser;

  if (isSelectAndGrab || isEraserTool || isMobile) return null;
  return (
    <ScrollArea className="z-[100] absolute top-22 bg-white dark:bg-surface-low border shadow-md rounded-md left-6 w-[210px] max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-190px)] overflow-y-auto">
      <div className="p-3 space-y-6">
        <StrokeOptions selectedShapeIndex={selectedShapeIndex} />
        {!isTextTool && (
          <BackgroundOptions selectedShapeIndex={selectedShapeIndex} />
        )}
        {!isTextTool && <FillStyle selectedShapeIndex={selectedShapeIndex} />}
        {!isTextTool && <StrokeWidth selectedShapeIndex={selectedShapeIndex} />}
        {!isPencilTool && !isTextTool && (
          <StrokeStyle selectedShapeIndex={selectedShapeIndex} />
        )}
        {!isPencilTool && !isTextTool && (
          <Sloppiness selectedShapeIndex={selectedShapeIndex} />
        )}
        {!isEllipseTool && !isArrowTool && !isPencilTool && !isTextTool && (
          <EdgeStyle selectedShapeIndex={selectedShapeIndex} />
        )}
        {isArrowTool && !isPencilTool && (
          <ArrowHeads selectedShapeIndex={selectedShapeIndex} />
        )}
        {isTextTool && <FontFamily selectedShapeIndex={selectedShapeIndex} />}
        {isTextTool && <FontSize selectedShapeIndex={selectedShapeIndex} />}
      </div>
    </ScrollArea>
  );
};
