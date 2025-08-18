/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import rough from "roughjs";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDraw } from "@/hooks/use-draw";
import { CanvasEngine } from "@/canvas-engine/canvas-engine";
import { useCanva } from "@/hooks/use-canva-store";
import { RoughCanvas } from "roughjs/bin/canvas";
import { useInfiniteCanvas } from "@/hooks/use-infinite-canvas";

export const CanvasBoard = () => {
  const { onSetCanva, onSetRoughCanvas, themeColor, canvaCursorType } =
    useCanva();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roughCanvas = useRef<RoughCanvas>(null);
  const [canvasEngine, setCanvasEngine] = useState<CanvasEngine | null>(null);
  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    scale,
    panX,
    panY,
  } = useInfiniteCanvas({ canvasRef });

  const { handlePointDown, handlePointMove, handlePointUp } = useDraw({
    canvasEngine,
    canvasRef,
    scale,
    panX,
    panY,
  });

  const handleUnifiedPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.pointerType === "touch") {
        handleTouchStart(
          [
            {
              identifier: e.pointerId,
              clientX: e.clientX,
              clientY: e.clientY,
            },
          ],
          () => e.preventDefault()
        );

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
        handleTouchMove(
          [
            {
              identifier: e.pointerId,
              clientX: e.clientX,
              clientY: e.clientY,
            },
          ],
          () => e.preventDefault()
        );

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
        handleTouchEnd(
          [
            {
              identifier: e.pointerId,
              clientX: e.clientX,
              clientY: e.clientY,
            },
          ],
          () => e.preventDefault()
        );

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
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      roughCanvas.current = rough.canvas(canvas);
      const canvasEngine = new CanvasEngine(canvas, roughCanvas.current);
      onSetCanva(canvas);
      onSetRoughCanvas(rough.canvas(canvas));
      setCanvasEngine(canvasEngine);

      canvas.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (canvasEngine) {
        canvasEngine.destroy();
        canvas?.removeEventListener("wheel", handleWheel);
      }
    };
  }, [onSetCanva, onSetRoughCanvas]);

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
