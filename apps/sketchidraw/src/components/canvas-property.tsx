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
import { RefObject } from "react";
import { Shape } from "@/types/shape";
import { ClientEvents } from "@/constants";

type CanvasPropertyProps = {
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

export const CanvasProperty = ({
  selectedShapeId,
  canvasRef,
  isConnected,
  shapes,
  sendEncryptedMessage,
}: CanvasPropertyProps) => {
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
  );
};
