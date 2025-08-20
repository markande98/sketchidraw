/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import rough from "roughjs";

import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useDraw } from "@/hooks/use-draw";
import { CanvasEngine } from "@/canvas-engine/canvas-engine";
import { useCanva } from "@/hooks/use-canva-store";
import { RoughCanvas } from "roughjs/bin/canvas";
import { TouchEvent } from "@/hooks/use-infinite-canvas";

type CanvasBoardProps = {
  panX: number;
  panY: number;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  handleTouchStart: (event: TouchEvent) => void;
  handleTouchMove: (event: TouchEvent) => void;
  handleTouchEnd: (event: TouchEvent) => void;
  handleWheel: (e: WheelEvent) => void;
};

export const CanvasBoard = ({
  panX,
  panY,
  canvasRef,
  handleTouchEnd,
  handleTouchMove,
  handleTouchStart,
  handleWheel,
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

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const roughCanvasInstance = rough.canvas(canvas);
    roughCanvas.current = roughCanvasInstance;

    const canvasEngine = new CanvasEngine(canvas, roughCanvasInstance);

    onSetCanva(canvas);
    onSetRoughCanvas(roughCanvasInstance);
    setCanvasEngine(canvasEngine);

    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvasEngine.destroy();
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [onSetCanva, onSetRoughCanvas, handleWheel]);

  // font loading
  useEffect(() => {
    const loadCustomFonts = async () => {
      if ("fonts" in document) {
        try {
          const sketchifont = new FontFace(
            "Sketchifont",
            "url(/fonts/Sketchidraw_Regular.woff2)"
          );
          const nunito = new FontFace("Nunito", "url(/fonts/Nunito.woff2)");
          const comicShanns = new FontFace(
            "Comic Shanns",
            "url(/fonts/ComicSans.woff2)"
          );

          await Promise.all([
            sketchifont.load(),
            nunito.load(),
            comicShanns.load(),
          ]);

          (document.fonts as any).add(sketchifont);
          (document.fonts as any).add(nunito);
          (document.fonts as any).add(comicShanns);
        } catch (error) {
          console.log("Custom fonts not available, using fallbacks", error);
        }
      }
    };
    loadCustomFonts();
  }, []);

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
