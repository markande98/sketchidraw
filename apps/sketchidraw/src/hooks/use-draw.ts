"use client";

import { CanvasEngine } from "@/canvas-engine/canvas-engine";
import { Shape } from "@/types/shape";
import { useEffect, useState } from "react";
import { useCanva } from "./use-canva-store";
import { ToolType } from "@/types/tools";
import { ShapeOptions } from "@/types/shape";
import { CursorType } from "@/constants";

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
  const { tooltype, canvaShapes, onSetCanvaShapes, onSetCanvaCursorType } =
    useCanva();
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(
    null
  );
  const [resizeHandle, setResizehandle] = useState<string | null>(null);

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
      canvasEngine.redrawShapes(selectedShapeIndex);

      if (currentShape) {
        canvasEngine.drawShape(currentShape);
      }
    }
  }, [canvaShapes, currentShape, canvas, canvasEngine, selectedShapeIndex]);

  const getMousePos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.top,
      y: e.clientY - rect.left,
    };
  };

  const handlePointDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    if (selectedShapeIndex !== null) {
      const shape = canvaShapes[selectedShapeIndex];
      const handle = canvasEngine?.getResizeHandle(pos, shape);
      if (handle) {
        setIsResizing(true);
        setResizehandle(handle);
        setDragStart(pos);
        switch (handle) {
          case "ne":
          case "sw":
            onSetCanvaCursorType(CursorType.NESWResize);
            break;
          case "nw":
          case "se":
            onSetCanvaCursorType(CursorType.NWSEResize);
            break;
          default:
            break;
        }
        return;
      }
    }

    if (tooltype === ToolType.Select) {
      let clickedShape = null;
      for (let i = 0; i < canvaShapes.length; i++) {
        if (canvasEngine?.isPointInshape(pos, canvaShapes[i])) {
          clickedShape = i;
          break;
        }
      }
      // console.log(clickedShape);
      if (clickedShape != null) {
        setSelectedShapeIndex(clickedShape);
        setIsDragging(true);
        setDragStart({
          x: pos.x,
          y: pos.y,
        });
      } else {
        setSelectedShapeIndex(null);
      }
    } else {
      setSelectedShapeIndex(null);
      setIsDrawing(true);
      switch (tooltype) {
        case ToolType.Rectangle:
          setCurrentShape({
            type: ToolType.Rectangle,
            startX: pos.x,
            startY: pos.y,
            endX: pos.x,
            endY: pos.y,
            edgeType: canvaEdge,
            ...options,
          });
          break;
        case ToolType.Ellipse:
          setCurrentShape({
            type: ToolType.Ellipse,
            startX: pos.x,
            startY: pos.y,
            endX: pos.x,
            endY: pos.y,
            ...options,
          });
          break;
        case ToolType.Diamond:
          setCurrentShape({
            type: ToolType.Diamond,
            startX: pos.x,
            startY: pos.y,
            endX: pos.x,
            endY: pos.y,
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
        case ToolType.Pencil:
          setCurrentShape({
            type: ToolType.Pencil,
            points: [[pos.x, pos.y]],
            ...options,
          });
          break;
        default:
          break;
      }
      setDragStart(pos);
    }
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  };

  const handlePointMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    if (isResizing && selectedShapeIndex !== null) {
      const shape = { ...canvaShapes[selectedShapeIndex] };
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;
      switch (shape.type) {
        case ToolType.Rectangle:
        case ToolType.Ellipse:
        case ToolType.Diamond:
          const result = canvasEngine?.resizeShape(
            shape.startX,
            shape.startY,
            shape.endX,
            shape.endY,
            dx,
            dy,
            resizeHandle
          );
          if (!result) return;
          const { startX, startY, endX, endY } = result;
          shape.startX = startX;
          shape.startY = startY;
          shape.endX = endX;
          shape.endY = endY;
          break;
        default:
          break;
      }
      const newShapes = [...canvaShapes];
      newShapes[selectedShapeIndex] = shape;
      onSetCanvaShapes(newShapes);
      setDragStart(pos);
    } else if (isDragging && selectedShapeIndex != null) {
      const newShapes = [...canvaShapes];
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;
      switch (newShapes[selectedShapeIndex].type) {
        case ToolType.Rectangle:
        case ToolType.Ellipse:
        case ToolType.Diamond:
          const shape = newShapes[selectedShapeIndex];
          const updatedShape = {
            ...shape,
            startX: shape.startX + dx,
            startY: shape.startY + dy,
            endX: shape.endX + dx,
            endY: shape.endY + dy,
          };
          newShapes[selectedShapeIndex] = updatedShape;
          break;
        default:
          break;
      }
      onSetCanvaCursorType(CursorType.Crossmove);
      onSetCanvaShapes(newShapes);
      setDragStart(pos);
    } else if (isDrawing && currentShape) {
      switch (tooltype) {
        case ToolType.Rectangle:
          setCurrentShape({
            type: ToolType.Rectangle,
            startX: Math.min(pos.x, dragStart.x),
            startY: Math.min(pos.y, dragStart.y),
            endX: Math.max(pos.x, dragStart.x),
            endY: Math.max(pos.y, dragStart.y),
            edgeType: canvaEdge,
            ...options,
          });
          break;
        case ToolType.Ellipse:
          setCurrentShape({
            type: ToolType.Ellipse,
            startX: Math.min(pos.x, dragStart.x),
            startY: Math.min(pos.y, dragStart.y),
            endX: Math.max(pos.x, dragStart.x),
            endY: Math.max(pos.y, dragStart.y),
            ...options,
          });
          break;
        case ToolType.Diamond:
          setCurrentShape({
            type: ToolType.Diamond,
            startX: Math.min(pos.x, dragStart.x),
            startY: Math.min(pos.y, dragStart.y),
            endX: Math.max(pos.x, dragStart.x),
            endY: Math.max(pos.y, dragStart.y),
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
        case ToolType.Pencil:
          setCurrentShape((prev) => {
            if (!prev || prev.type !== ToolType.Pencil) return prev;
            return {
              ...prev,
              points: [...prev.points, [pos.x, pos.y]],
              ...options,
            };
          });
          break;
        default:
          break;
      }
    }
  };

  const handlePointUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // const pos = getMousePos(e);
    if (isDrawing && currentShape) {
      onSetCanvaShapes([...canvaShapes, currentShape]);
      setCurrentShape(null);
    }
    if (isResizing && selectedShapeIndex !== null) {
      const shape = canvaShapes[selectedShapeIndex];
      switch (shape.type) {
        case ToolType.Rectangle:
        case ToolType.Ellipse:
        case ToolType.Diamond:
          const updatedShape = {
            ...shape,
            startX: Math.min(shape.startX, shape.endX),
            endX: Math.max(shape.startX, shape.endX),
            startY: Math.min(shape.startY, shape.endY),
            endY: Math.max(shape.endY, shape.startY),
          };
          canvaShapes[selectedShapeIndex] = updatedShape;
          onSetCanvaShapes(canvaShapes);
          break;
        default:
          break;
      }
    }
    onSetCanvaCursorType(CursorType.Crosshair);
    setIsDrawing(false);
    setIsDragging(false);
    setIsResizing(false);
    (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId);
  };

  return {
    handlePointDown,
    handlePointMove,
    handlePointUp,
  };
};
