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

type CanvasBoardProps = {
  panX: number;
  panY: number;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  handleTouchStart: (event: TouchEvent) => void;
  handleTouchMove: (event: TouchEvent) => void;
  handleTouchEnd: (event: TouchEvent) => void;
  handleWheel: (e: WheelEvent) => void;
  setCanvasState: React.Dispatch<SetStateAction<CanvasState>>;
  expandCanvasForPanning: () => void;
};

export const CanvasBoard = ({
  panX,
  panY,
  canvasRef,
  handleTouchEnd,
  handleTouchMove,
  handleTouchStart,
  handleWheel,
  setCanvasState,
  expandCanvasForPanning,
}: CanvasBoardProps) => {
  const { onSetCanva, onSetRoughCanvas, themeColor, canvaCursorType } =
    useCanva();
  const roughCanvas = useRef<RoughCanvas>(null);
  const [canvasEngine, setCanvasEngine] = useState<CanvasEngine | null>(null);

  const { handlePointDown, handlePointMove, handlePointUp } = useDraw({
    canvasEngine,
    canvasRef,
    panX,
    panY,
    setCanvasState,
    expandCanvasForPanning,
  });

  const handleUnifiedPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.pointerType === "touch") {
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

        if (e.isPrimary) {
          handlePointDown(e);
        }
      } else {
        handlePointDown(e);
      }
    },
    [handleTouchStart, handlePointDown]
  );

  const handleUnifiedPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.pointerType === "touch") {
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

        if (e.isPrimary) {
          handlePointMove(e);
        }
      } else {
        handlePointMove(e);
      }
    },
    [handleTouchMove, handlePointMove]
  );

  const handleUnifiedPointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.pointerType === "touch") {
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

        if (e.isPrimary) {
          handlePointUp(e);
        }
      } else {
        handlePointUp(e);
      }
    },
    [handleTouchEnd, handlePointUp]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      console.log(canvas.width, canvas.height);
    };

    const roughCanvasInstance = rough.canvas(canvas);
    roughCanvas.current = roughCanvasInstance;

    const canvasEngine = new CanvasEngine(canvas, roughCanvasInstance);

    onSetCanva(canvas);
    onSetRoughCanvas(roughCanvasInstance);
    setCanvasEngine(canvasEngine);

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", handleResize);

    handleResize();
    return () => {
      canvasEngine.destroy();
      canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
    };
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
