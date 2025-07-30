"use client";

import rough from "roughjs";

import { useEffect, useRef, useState } from "react";
import { RoughCanvas } from "roughjs/bin/canvas";
import { useTool } from "@/hooks/use-tool-store";
import { useDraw } from "@/hooks/use-draw";
import { CanvasEngine } from "@/canvas-engine/canvas-engine";

export const CanvasBoard = () => {
  const [canvasEngine, setCanvasEngine] = useState<CanvasEngine | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roughCanvas = useRef<RoughCanvas | null>(null);
  const { type } = useTool();
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useDraw({
    toolType: type,
    canvas: canvasRef.current,
    canvasEngine,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      roughCanvas.current = rough.canvas(canvas);
      const canvasEngine = new CanvasEngine(canvas, roughCanvas.current);
      setCanvasEngine(canvasEngine);
    }
  }, []);

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
