"use client";

import rough from "roughjs";

import {
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDraw } from "@/hooks/use-draw";
import { CanvasEngine } from "@/canvas-engine/canvas-engine";
import { useCanva } from "@/hooks/use-canva-store";
import { RoughCanvas } from "roughjs/bin/canvas";
import { CanvasState, TouchEvent } from "@/hooks/use-infinite-canvas";
import { RoomInfo } from "@/hooks/use-e2e-websocket";
import { Shape } from "@/types/shape";
import { ClientEvents } from "@/constants";

type CanvasBoardProps = {
  panX: number;
  panY: number;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  selectedShapeId: string | null;
  isConnected: boolean;
  wsRef: RefObject<WebSocket | null>;
  roomData: RoomInfo | null;
  shapes: Shape[];
  setSelectedShapeId: React.Dispatch<SetStateAction<string | null>>;
  handleTouchStart: (event: TouchEvent) => void;
  handleTouchMove: (event: TouchEvent) => void;
  handleTouchEnd: (event: TouchEvent) => void;
  handleWheel: (e: WheelEvent) => void;
  setCanvasState: React.Dispatch<SetStateAction<CanvasState>>;
  expandCanvasForPanning: () => void;
  sendEncryptedMessage: (
    shape: Shape,
    type: ClientEvents,
    toBeAdded: boolean,
    toBeDeleted: boolean
  ) => void;
};

export const CanvasBoard = ({
  panX,
  panY,
  canvasRef,
  isConnected,
  roomData,
  wsRef,
  shapes,
  sendEncryptedMessage,
  handleTouchEnd,
  handleTouchMove,
  handleTouchStart,
  handleWheel,
  selectedShapeId,
  setSelectedShapeId,
  setCanvasState,
  expandCanvasForPanning,
}: CanvasBoardProps) => {
  const {
    onSetCanva,
    onSetRoughCanvas,
    themeColor,
    canvaCursorType,
    canvasScale,
    canvaShapes,
  } = useCanva();
  const roughCanvas = useRef<RoughCanvas>(null);
  const [canvasEngine, setCanvasEngine] = useState<CanvasEngine | null>(null);

  const { handlePointDown, handlePointMove, handlePointUp, cursorPos } =
    useDraw({
      canvasEngine,
      canvasRef,
      panX,
      panY,
      isConnected,
      wsRef,
      roomData,
      shapes,
      sendEncryptedMessage,
      selectedShapeId,
      setSelectedShapeId,
      setCanvasState,
      expandCanvasForPanning,
    });

  const handleUnifiedPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.isPrimary) {
        handlePointDown(e);
      }
      if (e.pointerType === "touch" && !e.isPrimary) {
        const event: TouchEvent = {
          touches: [
            {
              identifier: e.pointerId,
              clientX: e.clientX,
              clientY: e.clientY,
            },
          ],
          preventDefault: () => e.preventDefault(),
        };
        handleTouchStart(event);
      }
    },
    [handleTouchStart, handlePointDown]
  );

  const handleUnifiedPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.isPrimary) {
        handlePointMove(e);
      }
      if (e.pointerType === "touch" && !e.isPrimary) {
        const event: TouchEvent = {
          touches: [
            {
              identifier: e.pointerId,
              clientX: e.clientX,
              clientY: e.clientY,
            },
          ],
          preventDefault: () => e.preventDefault(),
        };
        handleTouchMove(event);
      }
    },
    [handleTouchMove, handlePointMove]
  );

  const handleUnifiedPointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.isPrimary) {
        handlePointUp(e);
      }
      if (e.pointerType === "touch" && !e.isPrimary) {
        const event: TouchEvent = {
          touches: [
            {
              identifier: e.pointerId,
              clientX: e.clientX,
              clientY: e.clientY,
            },
          ],
          preventDefault: () => e.preventDefault(),
        };
        handleTouchEnd(event);
      }
    },
    [handleTouchEnd, handlePointUp]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const roughCanvasInstance = rough.canvas(canvas);
    roughCanvas.current = roughCanvasInstance;

    const canvasEngine = new CanvasEngine(canvas, roughCanvasInstance);

    onSetCanva(canvas);
    onSetRoughCanvas(roughCanvasInstance);
    setCanvasEngine(canvasEngine);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cursor = document.getElementById("cursor");
      if (canvasEngine) {
        const currentShapes = isConnected ? shapes : canvaShapes;

        canvasEngine.redrawShapes(
          selectedShapeId,
          canvasScale,
          panX,
          panY,
          isConnected,
          currentShapes
        );
      }
      if (cursor) {
        cursor.style.transform = `translate(${cursorPos.x * canvasScale + panX}px, ${cursorPos.y * canvasScale + panY}px)`;
      }
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", handleResize);

    handleResize();
    return () => {
      if (canvasEngine) canvasEngine.destroy();
      if (canvas) canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSetCanva, onSetRoughCanvas, handleWheel]);

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handleUnifiedPointerDown}
      onPointerMove={handleUnifiedPointerMove}
      onPointerUp={handleUnifiedPointerUp}
      onContextMenu={(e) => e.preventDefault()}
      tabIndex={0}
      className="absolute inset-0"
      style={{
        backgroundColor: themeColor,
        cursor: canvaCursorType,
        touchAction: "none",
        outline: "none",
      }}
    />
  );
};
