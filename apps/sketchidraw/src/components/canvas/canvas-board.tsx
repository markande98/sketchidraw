"use client";

import rough from "roughjs";

import { useEffect, useRef, useState } from "react";
import { useDraw } from "@/hooks/use-draw";
import { CanvasEngine } from "@/canvas-engine/canvas-engine";
import { useCanva } from "@/hooks/use-canva-store";
import { RoughCanvas } from "roughjs/bin/canvas";

export const CanvasBoard = () => {
  const { onSetCanva, onSetRoughCanvas } = useCanva();
  const [canvasEngine, setCanvasEngine] = useState<CanvasEngine | null>(null);
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useDraw({
    canvasEngine,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roughCanvas = useRef<RoughCanvas>(null);

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
  }, [onSetCanva, onSetRoughCanvas]);

  return (
    <canvas
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="absolute z-[5]"
      ref={canvasRef}
    />
  );
};
