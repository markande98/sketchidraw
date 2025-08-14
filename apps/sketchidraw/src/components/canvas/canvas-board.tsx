"use client";

import rough from "roughjs";

import { useEffect, useRef, useState } from "react";
import { useDraw } from "@/hooks/use-draw";
import { CanvasEngine } from "@/canvas-engine/canvas-engine";
import { useCanva } from "@/hooks/use-canva-store";
import { RoughCanvas } from "roughjs/bin/canvas";
import { useText } from "@/hooks/use-text";

export const CanvasBoard = () => {
  const { onSetCanva, onSetRoughCanvas, themeColor, canvaCursorType } =
    useCanva();
  const [canvasEngine, setCanvasEngine] = useState<CanvasEngine | null>(null);
  const { handlePointDown, handlePointMove, handlePointUp } = useDraw({
    canvasEngine,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roughCanvas = useRef<RoughCanvas>(null);
  const { handleMouseDown, handleMouseUp, handleMouseMove } = useText({
    canvasRef,
  });

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
    }

    return () => {
      if (canvasEngine) {
        canvasEngine.destroy();
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
      onPointerDown={handlePointDown}
      onPointerMove={handlePointMove}
      onPointerUp={handlePointUp}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
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
