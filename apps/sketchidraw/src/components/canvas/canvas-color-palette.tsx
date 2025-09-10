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
import { Shape } from "@/types/shape";
import { RefObject } from "react";
import { ClientEvents } from "@/constants";

type CanvasColorPaletteProps = {
  selectedShapeId: string | null;
  isConnected: boolean;
  shapes: Shape[];
  canvasRef: RefObject<HTMLCanvasElement | null>;
  sendEncryptedMessage: (
    shape: Shape,
    type: ClientEvents,
    toBeAdded: boolean,
    toBeDeleted: boolean
  ) => void;
};

export const CanvasColorPalette = ({
  selectedShapeId,
  isConnected,
  shapes,
  canvasRef,
  sendEncryptedMessage,
}: CanvasColorPaletteProps) => {
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
            <StrokeOptions
              isConnected={isConnected}
              shapes={shapes}
              selectedShapeId={selectedShapeId}
              sendEncryptedMessage={sendEncryptedMessage}
            />
            {!isTextTool && (
              <BackgroundOptions
                isConnected={isConnected}
                shapes={shapes}
                selectedShapeId={selectedShapeId}
                sendEncryptedMessage={sendEncryptedMessage}
              />
            )}
            {!isTextTool && (
              <FillStyle
                isConnected={isConnected}
                shapes={shapes}
                selectedShapeId={selectedShapeId}
                sendEncryptedMessage={sendEncryptedMessage}
              />
            )}
            {!isTextTool && (
              <StrokeWidth
                isConnected={isConnected}
                shapes={shapes}
                selectedShapeId={selectedShapeId}
                sendEncryptedMessage={sendEncryptedMessage}
              />
            )}
            {!isPencilTool && !isTextTool && (
              <StrokeStyle
                isConnected={isConnected}
                shapes={shapes}
                selectedShapeId={selectedShapeId}
                sendEncryptedMessage={sendEncryptedMessage}
              />
            )}
            {!isPencilTool && !isTextTool && (
              <Sloppiness
                isConnected={isConnected}
                shapes={shapes}
                selectedShapeId={selectedShapeId}
                sendEncryptedMessage={sendEncryptedMessage}
              />
            )}
            {!isEllipseTool && !isArrowTool && !isPencilTool && !isTextTool && (
              <EdgeStyle
                isConnected={isConnected}
                shapes={shapes}
                selectedShapeId={selectedShapeId}
                sendEncryptedMessage={sendEncryptedMessage}
              />
            )}
            {isArrowTool && !isPencilTool && (
              <ArrowHeads
                isConnected={isConnected}
                shapes={shapes}
                selectedShapeId={selectedShapeId}
                sendEncryptedMessage={sendEncryptedMessage}
              />
            )}
            {isTextTool && (
              <FontFamily
                isConnected={isConnected}
                shapes={shapes}
                selectedShapeId={selectedShapeId}
                sendEncryptedMessage={sendEncryptedMessage}
              />
            )}
            {isTextTool && (
              <FontSize
                canvasRef={canvasRef}
                isConnected={isConnected}
                shapes={shapes}
                selectedShapeId={selectedShapeId}
                sendEncryptedMessage={sendEncryptedMessage}
              />
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
