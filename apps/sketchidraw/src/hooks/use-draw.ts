"use client";

import { CanvasEngine } from "@/canvas-engine/canvas-engine";
import { Shape } from "@/types/shape";
import { useEffect, useState } from "react";
import { useCanva } from "./use-canva-store";
import { ToolType } from "@/types/tools";
import { ShapeOptions } from "@/types/shape";

type DrawProps = {
  canvasEngine: CanvasEngine | null;
};

export const useDraw = ({ canvasEngine }: DrawProps) => {
  const {
    canvas,
    canvaBgColor,
    canvaStrokeColor,
    canvaStrokeWidth,
    canvaStrokeDashOffset,
    canvaFillstyle,
    canvaSloppiness,
    canvaEdge,
    canvaArrowType,
  } = useCanva();
  const { tooltype } = useCanva();
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const options: ShapeOptions = {
    fill: canvaBgColor,
    fillStyle: canvaFillstyle,
    stroke: canvaStrokeColor,
    strokeWidth: canvaStrokeWidth,
    strokeDashOffset: canvaStrokeDashOffset,
    sloppiness: canvaSloppiness,
  };

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
    switch (tooltype) {
      case ToolType.Rectangle:
        setCurrentShape({
          type: ToolType.Rectangle,
          x: pos.x,
          y: pos.y,
          height: 0,
          width: 0,
          edgeType: canvaEdge,
          ...options,
        });
        break;
      case ToolType.Ellipse:
        setCurrentShape({
          type: ToolType.Ellipse,
          centerX: pos.x,
          centerY: pos.y,
          height: 0,
          width: 0,
          ...options,
        });
        break;
      case ToolType.Diamond:
        setCurrentShape({
          type: ToolType.Diamond,
          centerX: pos.x,
          centerY: pos.y,
          height: 0,
          width: 0,
          ...options,
        });
        break;
      case ToolType.Line:
        setCurrentShape({
          type: ToolType.Line,
          startX: pos.x,
          startY: pos.y,
          endX: pos.x,
          endY: pos.y,
          ...options,
        });
        break;
      case ToolType.Arrow:
        setCurrentShape({
          type: ToolType.Arrow,
          startX: pos.x,
          startY: pos.y,
          endX: pos.x,
          endY: pos.y,
          arrowType: canvaArrowType,
          ...options,
        });
        break;
      default:
        break;
    }
    setDragStart(pos);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    if (isDrawing && currentShape) {
      switch (tooltype) {
        case ToolType.Rectangle:
          setCurrentShape({
            type: ToolType.Rectangle,
            x: Math.min(pos.x, dragStart.x),
            y: Math.min(pos.y, dragStart.y),
            height: Math.abs(pos.y - dragStart.y),
            width: Math.abs(pos.x - dragStart.x),
            edgeType: canvaEdge,
            ...options,
          });
          break;
        case ToolType.Ellipse:
          setCurrentShape({
            type: ToolType.Ellipse,
            centerX: dragStart.x + (pos.x - dragStart.x) / 2,
            centerY: dragStart.y + (pos.y - dragStart.y) / 2,
            height: Math.abs(pos.y - dragStart.y),
            width: Math.abs(pos.x - dragStart.x),
            ...options,
          });
          break;
        case ToolType.Diamond:
          setCurrentShape({
            type: ToolType.Diamond,
            centerX: dragStart.x + (pos.x - dragStart.x) / 2,
            centerY: dragStart.y + (pos.y - dragStart.y) / 2,
            height: Math.abs(pos.y - dragStart.y) / 2,
            width: Math.abs(pos.x - dragStart.x) / 2,
            ...options,
          });
          break;
        case ToolType.Line:
          setCurrentShape({
            type: ToolType.Line,
            startX: dragStart.x,
            startY: dragStart.y,
            endX: pos.x,
            endY: pos.y,
            ...options,
          });
          break;
        case ToolType.Arrow:
          setCurrentShape({
            type: ToolType.Arrow,
            startX: dragStart.x,
            startY: dragStart.y,
            endX: pos.x,
            endY: pos.y,
            arrowType: canvaArrowType,
            ...options,
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
