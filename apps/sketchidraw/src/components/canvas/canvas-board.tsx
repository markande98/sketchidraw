"use client";

import rough from "roughjs";

import { useCallback, useEffect, useRef, useState } from "react";
import { RoughCanvas } from "roughjs/bin/canvas";

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const CanvasBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  //   const [isDragging, setIsDragging] = useState(false);
  const [currentRect, setCurrectRect] = useState<Rectangle | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const roughCanvas = useRef<RoughCanvas>(null);

  const redraw = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rc = roughCanvas.current;

    // clear canvas;
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    rectangles.forEach((rect) => {
      rc?.rectangle(rect.x, rect.y, rect.width, rect.height, {
        stroke: "#ef4444",
        strokeWidth: 1,
        fill: "rgba(79, 70, 229, 0.1)",
        fillStyle: "hachure",
      });
    });

    if (currentRect) {
      rc?.rectangle(
        currentRect.x,
        currentRect.y,
        currentRect.width,
        currentRect.height,
        {
          stroke: "#ef4444",
          strokeWidth: 1,
          fill: "rgba(239, 68, 68, 0.1)",
          fillStyle: "hachure",
        }
      );
    }
  }, [currentRect, rectangles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      roughCanvas.current = rough.canvas(canvas);
      redraw();
    }
  }, [redraw]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    setCurrectRect({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
    });
    setDragStart(pos);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    if (isDrawing && currentRect) {
      setCurrectRect({
        x: dragStart.x,
        y: dragStart.y,
        width: Math.abs(dragStart.x - pos.x),
        height: Math.abs(dragStart.y - pos.y),
      });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentRect) {
      if (currentRect.x > 5 && currentRect.y > 5) {
        setRectangles([...rectangles, currentRect]);
      }
      setCurrectRect(null);
    }
    setIsDrawing(false);
  };

  return (
    <canvas
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="absolute z-[5]"
      ref={canvasRef}
    />
  );
};
