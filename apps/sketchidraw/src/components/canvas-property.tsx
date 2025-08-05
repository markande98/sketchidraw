"use client";

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

export const CanvasProperty = () => {
  const { tooltype } = useCanva();

  const isEllipseTool = tooltype === ToolType.Ellipse;
  const isArrowTool = tooltype === ToolType.Arrow;
  return (
    <ScrollArea className="z-[100] absolute top-22 bg-surface-high/50 rounded-md left-6 w-[200px] max-h-[calc(100vh-250px)] overflow-y-auto">
      <div className="p-3 space-y-6 text-neutral-800">
        <StrokeOptions />
        <BackgroundOptions />
        <FillStyle />
        <StrokeWidth />
        <StrokeStyle />
        <Sloppiness />
        {!isEllipseTool && !isArrowTool && <EdgeStyle />}
        {isArrowTool && <ArrowHeads />}
      </div>
    </ScrollArea>
  );
};
