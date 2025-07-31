import { CanvasEngine } from "@/canvas-engine/canvas-engine";
import { Shape } from "@/types/shape";
import { useEffect, useState } from "react";
import { useCanva } from "./use-canva-store";

type DrawProps = {
  canvasEngine: CanvasEngine | null;
};

export const useDraw = ({ canvasEngine }: DrawProps) => {
  const { canvas, tooltype } = useCanva();
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (canvas && canvasEngine) {
      canvasEngine.redrawShapes();

      if (currentShape) {
        canvasEngine.drawShape(currentShape);
      }
    }
  }, [shapes, currentShape, canvas, canvasEngine]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.top,
      y: e.clientY - rect.left,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    setCurrentShape({
      type: tooltype,
      x: pos.x,
      y: pos.y,
      height: 0,
      width: 0,
    });
    setDragStart(pos);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    if (isDrawing && currentShape) {
      switch (currentShape.type) {
        case "Rectangle":
          setCurrentShape({
            type: tooltype,
            x: Math.min(pos.x, dragStart.x),
            y: Math.min(pos.y, dragStart.y),
            height: Math.abs(pos.y - dragStart.y),
            width: Math.abs(pos.x - dragStart.x),
          });
          break;
        default:
          break;
      }
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentShape) {
      setShapes([...shapes, currentShape]);
      canvasEngine?.addShape(currentShape);
      setCurrentShape(null);
    }
    setIsDrawing(false);
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
