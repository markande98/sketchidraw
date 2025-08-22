"use client";

import { useMediaQuery } from "use-media-query-react";
import { CanvasPropertyPaletteSvg } from "@/constants/svg";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { StrokeOptions } from "../stroke-options";
import { BackgroundOptions } from "../background-options";
import { FillStyle } from "../fill-style";
import { StrokeWidth } from "../stroke-width";
import { StrokeStyle } from "../stroke-style";
import { Sloppiness } from "../sloppiness";
import { ArrowHeads } from "../arrow-heads";
import { FontFamily } from "../font-family";
import { FontSize } from "../font-size";
import { EdgeStyle } from "../edge.style";
import { ToolType } from "@/types/tools";
import { useCanva } from "@/hooks/use-canva-store";
import { Button } from "../ui/button";

export const CanvasColorPalette = () => {
  const { tooltype } = useCanva();
  const isMobile = useMediaQuery("(max-width: 639px)");
  if (!isMobile) return null;

  const isEllipseTool = tooltype === ToolType.Ellipse;
  const isArrowTool = tooltype === ToolType.Arrow;
  const isPencilTool = tooltype === ToolType.Pencil;
  const isSelectAndGrab =
    tooltype === ToolType.Grab || tooltype === ToolType.Select;
  const isTextTool = tooltype === ToolType.Text;
  const isEraserTool = tooltype === ToolType.Eraser;

  if (isSelectAndGrab || isEraserTool) return null;
  console.log(isMobile);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CanvasPropertyPaletteSvg />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 border-none bg-transparent shadow-none"
        style={{
          marginLeft: "24px",
          marginRight: "24px",
          width: "calc(100% - 48px)",
        }}
        align="start"
      >
        <ScrollArea className="mb-3 bg-white dark:bg-surface-low border w-[calc(100vw-48px)] shadow-md rounded-md max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="p-3 space-y-6">
            <StrokeOptions />
            {!isTextTool && <BackgroundOptions />}
            {!isTextTool && <FillStyle />}
            {!isTextTool && <StrokeWidth />}
            {!isPencilTool && !isTextTool && <StrokeStyle />}
            {!isPencilTool && !isTextTool && <Sloppiness />}
            {!isEllipseTool && !isArrowTool && !isPencilTool && !isTextTool && (
              <EdgeStyle />
            )}
            {isArrowTool && !isPencilTool && <ArrowHeads />}
            {isTextTool && <FontFamily />}
            {isTextTool && <FontSize />}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
