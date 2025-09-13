"use client";

import { v4 as uuidv4 } from "uuid";

import { CanvasEngine } from "@/canvas-engine/canvas-engine";
import { Shape } from "@/types/shape";
import {
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useCanva } from "./use-canva-store";
import { ToolType } from "@/types/tools";
import { ShapeOptions } from "@/types/shape";
import { ClientEvents, CursorType } from "@/constants";
import { useText } from "./use-text";
import { CanvasState } from "./use-infinite-canvas";
import { RoomInfo } from "./use-e2e-websocket";
import { useCurrentUser } from "./use-current-user";

type DrawProps = {
  canvasEngine: CanvasEngine | null;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  panX: number;
  panY: number;
  isConnected: boolean;
  wsRef: RefObject<WebSocket | null>;
  roomData: RoomInfo | null;
  selectedShapeId: string | null;
  shapes: Shape[];
  setSelectedShapeId: React.Dispatch<SetStateAction<string | null>>;
  setCanvasState: React.Dispatch<SetStateAction<CanvasState>>;
  expandCanvasForPanning: () => void;
  sendEncryptedMessage: (
    shape: Shape,
    type: ClientEvents,
    toBeAdded: boolean,
    toBeDeleted: boolean
  ) => void;
};

export const useDraw = ({
  canvasEngine,
  canvasRef,
  panX,
  panY,
  isConnected,
  wsRef,
  roomData,
  shapes,
  sendEncryptedMessage,
  selectedShapeId,
  setSelectedShapeId,
  setCanvasState,
  expandCanvasForPanning,
}: DrawProps) => {
  const { currentUser } = useCurrentUser();
  const {
    canvaBgColor,
    canvaStrokeColor,
    canvaStrokeWidth,
    canvaStrokeDashOffset,
    canvaFillstyle,
    canvaSloppiness,
    canvaEdge,
    canvasScale,
    canvaArrowType,
    tooltype,
    canvaShapes,
    onSetCanvaShapes,
    onSetCanvaCursorType,
  } = useCanva();

  const { handleMouseDown, handleMouseMove, handleMouseUp } = useText({
    canvasEngine,
    canvasRef,
    panX,
    panY,
    selectedShapeId,
    isConnected,
    sendEncryptedMessage,
    newShapes: shapes,
  });
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [resizeHandle, setResizehandle] = useState<string | null>(null);
  const lastSentPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastSentTime = useRef<number>(0);
  const pendingCursorUpdate = useRef<NodeJS.Timeout | null>(null);

  // Constants for optimization
  const CURSOR_UPDATE_THROTTLE_MS = 16; // ~60fps
  const MIN_DISTANCE_THRESHOLD = 2; // pixels
  const BATCH_DELAY_MS = 10; // milliseconds

  const shapesToBeChosen = isConnected ? shapes : canvaShapes;

  const sendCursorPosition = useCallback(
    (pos: { x: number; y: number }) => {
      if (
        !isConnected ||
        !roomData ||
        !wsRef.current ||
        wsRef.current.readyState !== WebSocket.OPEN
      ) {
        return;
      }

      const now = Date.now();
      const timeDiff = now - lastSentTime.current;

      // Calculate distance from last sent position
      const distance = Math.sqrt(
        Math.pow(pos.x - lastSentPosition.current.x, 2) +
          Math.pow(pos.y - lastSentPosition.current.y, 2)
      );

      // Only send if enough time has passed AND cursor moved significantly
      if (
        timeDiff >= CURSOR_UPDATE_THROTTLE_MS &&
        distance >= MIN_DISTANCE_THRESHOLD
      ) {
        wsRef.current.send(
          JSON.stringify({
            type: ClientEvents.CursorMove,
            payload: {
              roomId: roomData.roomId,
              userId: currentUser?.id,
              cursorPos: pos,
            },
          })
        );

        lastSentPosition.current = pos;
        lastSentTime.current = now;
      }
    },
    [isConnected, roomData, wsRef, currentUser?.id]
  );

  // Debounced version for final position
  const sendCursorPositionDebounced = useCallback(
    (pos: { x: number; y: number }) => {
      // Clear existing timeout
      if (pendingCursorUpdate.current) {
        clearTimeout(pendingCursorUpdate.current);
      }

      // Set new timeout to send final position
      pendingCursorUpdate.current = setTimeout(() => {
        if (
          isConnected &&
          roomData &&
          wsRef.current &&
          wsRef.current.readyState === WebSocket.OPEN
        ) {
          wsRef.current.send(
            JSON.stringify({
              type: ClientEvents.CursorMove,
              payload: {
                roomId: roomData.roomId,
                userId: currentUser?.id,
                cursorPos: pos,
              },
            })
          );
          lastSentPosition.current = pos;
          lastSentTime.current = Date.now();
        }
      }, BATCH_DELAY_MS);
    },
    [isConnected, roomData, wsRef, currentUser?.id]
  );

  const options: ShapeOptions = {
    isDeleted: false,
    fill: canvaBgColor,
    fillStyle: canvaFillstyle,
    stroke: canvaStrokeColor,
    strokeWidth: canvaStrokeWidth,
    strokeDashOffset: canvaStrokeDashOffset,
    sloppiness: canvaSloppiness,
  };

  useEffect(() => {
    if (canvasEngine) {
      canvasEngine.redrawShapes(
        selectedShapeId,
        canvasScale,
        panX,
        panY,
        isConnected,
        shapesToBeChosen
      );

      if (currentShape) {
        canvasEngine.drawShape(currentShape, canvasScale, panX, panY);
      }
    }
  }, [
    shapesToBeChosen,
    currentShape,
    canvasEngine,
    selectedShapeId,
    canvasScale,
    panX,
    panY,
    isConnected,
  ]);

  const getMousePos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvasElement = canvasRef.current || (e.target as HTMLCanvasElement);
    if (!canvasElement) return { x: 0, y: 0 };
    const rect = canvasElement.getBoundingClientRect();

    const scaleX = canvasElement.offsetWidth / canvasElement.scrollWidth;
    const scaleY = canvasElement.offsetHeight / canvasElement.scrollHeight;

    return {
      x: ((e.clientX - rect.left) / scaleX - panX) / canvasScale,
      y: ((e.clientY - rect.top) / scaleY - panY) / canvasScale,
    };
  };

  useEffect(() => {
    if (tooltype !== ToolType.Eraser) return;

    const cursor = document.createElement("div");
    cursor.id = "cursor";
    document.body.appendChild(cursor);

    const handleCursorMove = (e: PointerEvent) => {
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;

      const rect = canvasElement.getBoundingClientRect();

      const scaleX = canvasElement.offsetWidth / canvasElement.scrollWidth || 1;
      const scaleY =
        canvasElement.offsetHeight / canvasElement.scrollHeight || 1;

      const isWithinCanvas =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!isWithinCanvas) {
        cursor.style.display = "none";
        return;
      }

      cursor.style.display = "block";

      const cursorPos = {
        x: (e.clientX - rect.left) / scaleX,
        y: (e.clientY - rect.top) / scaleY,
      };

      cursor.style.transform = `translate(${cursorPos.x}px, ${cursorPos.y}px)`;

      const pos = {
        x: (cursorPos.x - panX) / canvasScale,
        y: (cursorPos.y - panY) / canvasScale,
      };

      setCursorPos(pos);
    };

    document.addEventListener("pointermove", handleCursorMove, {
      passive: true,
    });

    cursor.style.transform = `translate(${cursorPos.x * canvasScale + panX}px, ${cursorPos.y * canvasScale + panY}px)`;

    return () => {
      if (cursor && cursor.parentNode) {
        cursor.parentNode.removeChild(cursor);
      }
      document.removeEventListener("pointermove", handleCursorMove);
    };
  }, [tooltype, canvasRef, panX, panY, canvasScale, cursorPos]);

  const measureText = (text: string, fontSize: number, fontFamily: string) => {
    if (typeof document !== "undefined") {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.font = `${fontSize}px ${fontFamily}`;
        const lines = text.split("\n");
        let maxWidth = 0;
        lines.forEach((line) => {
          const metrics = ctx.measureText(line);
          maxWidth = Math.max(maxWidth, metrics.width);
        });
        return {
          width: maxWidth,
          height: lines.length * fontSize * 1.2,
        };
      }
    }
    const avgCharWidth = fontSize * 0.6;
    const lines = text.split("\n");
    const maxLineLength = Math.max(...lines.map((line) => line.length));
    return {
      width: maxLineLength * avgCharWidth,
      height: lines.length * fontSize * 1.2,
    };
  };
  const handlePointDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (tooltype === ToolType.Grab) {
      const pos = getMousePos(e);
      onSetCanvaCursorType(CursorType.Grabbing);
      setDragStart(pos);
      setIsDragging(true);
      return;
    }
    if (tooltype === ToolType.Eraser) {
      setIsDeleting(true);
      setSelectedShapeId(null);
      let updatedCanvas = shapesToBeChosen;
      updatedCanvas = updatedCanvas.map((shape) => {
        let updatedShape = shape;
        if (canvasEngine?.isPointInshape(cursorPos, shape)) {
          updatedShape = {
            ...shape,
            isDeleted: true,
          };
        }
        if (isConnected && updatedShape.isDeleted)
          sendEncryptedMessage(
            updatedShape,
            ClientEvents.Encryption,
            false,
            true
          );
        return updatedShape;
      });
      if (!isConnected) onSetCanvaShapes([...updatedCanvas]);
      return;
    }
    if (tooltype === ToolType.Text) {
      setSelectedShapeId(null);
      handleMouseDown(e);
      return;
    }
    const pos = getMousePos(e);
    if (selectedShapeId !== null) {
      const shape = shapesToBeChosen.find((s) => s.id === selectedShapeId);
      if (shape) {
        const handle = canvasEngine?.getResizeHandle(pos, shape, canvasScale);
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
            case "start":
            case "mid":
            case "end":
              onSetCanvaCursorType(CursorType.Pointer);
              break;
            default:
              break;
          }
          return;
        }
      }
    }

    if (tooltype === ToolType.Select) {
      let clickedId = null;
      for (let i = 0; i < shapesToBeChosen.length; i++) {
        if (canvasEngine?.isPointInshape(pos, shapesToBeChosen[i])) {
          clickedId = shapesToBeChosen[i].id;
          break;
        }
      }
      if (clickedId !== null) {
        setIsDragging(true);
        setDragStart({
          x: pos.x,
          y: pos.y,
        });
        setSelectedShapeId(clickedId);
        return;
      }
      setSelectedShapeId((prev) => {
        if (clickedId === null) return null;
        if (prev !== null) {
          setIsDragging(true);
          setDragStart({
            x: pos.x,
            y: pos.y,
          });
          return prev;
        }
        return null;
      });
      return;
    }

    setIsDrawing(true);
    switch (tooltype) {
      case ToolType.Rectangle:
        setCurrentShape({
          type: ToolType.Rectangle,
          id: uuidv4(),
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
          id: uuidv4(),
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
          id: uuidv4(),
          startX: pos.x,
          startY: pos.y,
          endX: pos.x,
          endY: pos.y,
          edgeType: canvaEdge,
          ...options,
        });
        break;
      case ToolType.Line:
        setCurrentShape({
          type: ToolType.Line,
          id: uuidv4(),
          startX: pos.x,
          startY: pos.y,
          endX: pos.x,
          endY: pos.y,
          sX: pos.x,
          sY: pos.y,
          mX: pos.x,
          mY: pos.y,
          eX: pos.x,
          eY: pos.y,
          ...options,
        });
        break;
      case ToolType.Arrow:
        setCurrentShape({
          type: ToolType.Arrow,
          id: uuidv4(),
          startX: pos.x,
          startY: pos.y,
          endX: pos.x,
          endY: pos.y,
          sX: pos.x,
          sY: pos.y,
          mX: pos.x,
          mY: pos.y,
          eX: pos.x,
          eY: pos.y,
          arrowType: canvaArrowType,
          ...options,
        });
        break;
      case ToolType.Pencil:
        setCurrentShape({
          type: ToolType.Pencil,
          id: uuidv4(),
          startX: pos.x,
          startY: pos.y,
          endX: pos.x,
          endY: pos.y,
          points: [[pos.x, pos.y]],
          ...options,
        });
        break;
      default:
        break;
    }
    setDragStart(pos);
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  };
  const handlePointMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    sendCursorPosition(pos);
    sendCursorPositionDebounced(pos);

    if (tooltype === ToolType.Text) {
      handleMouseMove(e);
      return;
    }
    if (isResizing && selectedShapeId !== null) {
      const shape = {
        ...shapesToBeChosen.find((s) => s.id === selectedShapeId)!,
      };
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;
      switch (shape.type) {
        case ToolType.Rectangle:
        case ToolType.Ellipse:
        case ToolType.Diamond:
        case ToolType.Line:
        case ToolType.Arrow:
        case ToolType.Pencil:
          const result = canvasEngine?.resizeShape(
            shape.type,
            shape.startX,
            shape.startY,
            shape.endX,
            shape.endY,
            dx,
            dy,
            resizeHandle,
            shape.type === ToolType.Line || shape.type === ToolType.Arrow
              ? shape.sX
              : 0,
            shape.type === ToolType.Line || shape.type === ToolType.Arrow
              ? shape.sY
              : 0,
            shape.type === ToolType.Line || shape.type === ToolType.Arrow
              ? shape.mX
              : 0,
            shape.type === ToolType.Line || shape.type === ToolType.Arrow
              ? shape.mY
              : 0,
            shape.type === ToolType.Line || shape.type === ToolType.Arrow
              ? shape.eX
              : 0,
            shape.type === ToolType.Line || shape.type === ToolType.Arrow
              ? shape.eY
              : 0
          );
          if (!result) return;
          const { startX, startY, endX, endY, sX, sY, mX, mY, eX, eY } = result;
          if (shape.type === ToolType.Line || shape.type === ToolType.Arrow) {
            switch (resizeHandle) {
              case "start":
              case "mid":
              case "end":
                shape.sX = sX;
                shape.sY = sY;
                shape.mX = mX;
                shape.mY = mY;
                shape.eX = eX;
                shape.eY = eY;
                shape.startX = Math.min(sX, eX, mX);
                shape.startY = Math.min(sY, mY, eY);
                shape.endX = Math.max(sX, mX, eX);
                shape.endY = Math.max(sY, mY, eY);
                break;
              default:
                const newShape = { ...shape };
                const originalWidth = shape.endX - shape.startX;
                const originalHeight = shape.endY - shape.startY;
                const newWidth = endX - startX;
                const newHeight = endY - startY;

                if (originalWidth === 0 || originalHeight === 0) {
                  newShape.sX = startX;
                  newShape.sY = startY;
                  newShape.mX = startX;
                  newShape.mY = startY;
                  newShape.eX = startX;
                  newShape.eY = startY;
                } else {
                  const relStartX = (shape.sX - shape.startX) / originalWidth;
                  const relStartY = (shape.sY - shape.startY) / originalHeight;
                  const relMidX = (shape.mX - shape.startX) / originalWidth;
                  const relMidY = (shape.mY - shape.startY) / originalHeight;
                  const relEndXPos = (shape.eX - shape.startX) / originalWidth;
                  const relEndYPos = (shape.eY - shape.startY) / originalHeight;

                  newShape.sX = startX + relStartX * newWidth;
                  newShape.sY = startY + relStartY * newHeight;
                  newShape.mX = startX + relMidX * newWidth;
                  newShape.mY = startY + relMidY * newHeight;
                  newShape.eX = startX + relEndXPos * newWidth;
                  newShape.eY = startY + relEndYPos * newHeight;
                }

                shape.startX = startX;
                shape.startY = startY;
                shape.endX = endX;
                shape.endY = endY;
                shape.sX = newShape.sX;
                shape.sY = newShape.sY;
                shape.mX = newShape.mX;
                shape.mY = newShape.mY;
                shape.eX = newShape.eX;
                shape.eY = newShape.eY;
                break;
            }
          } else if (shape.type === ToolType.Pencil) {
            const originalWidth = shape.endX - shape.startX;
            const originalHeight = shape.endY - shape.startY;
            const newWidth = endX - startX;
            const newHeight = endY - startY;

            const updatedPoints = shape.points.map((point) => {
              if (originalWidth === 0 || originalHeight === 0) {
                return [startX, startY];
              } else {
                const relX = (point[0] - shape.startX) / originalWidth;
                const relY = (point[1] - shape.startY) / originalHeight;

                return [startX + relX * newWidth, startY + relY * newHeight];
              }
            }) as [x: number, y: number][];
            shape.startX = startX;
            shape.startY = startY;
            shape.endX = endX;
            shape.endY = endY;
            shape.points = updatedPoints;
          } else {
            shape.startX = startX;
            shape.startY = startY;
            shape.endX = endX;
            shape.endY = endY;
          }
          break;
        case ToolType.Text:
          const resultText = canvasEngine?.resizeShape(
            shape.type,
            shape.startX,
            shape.startY,
            shape.endX,
            shape.endY,
            dx,
            dy,
            resizeHandle,
            0,
            0,
            0,
            0,
            0,
            0
          );
          if (!resultText) return;
          const {
            startX: nStartX,
            startY: nStartY,
            endX: nEndX,
            endY: nEndY,
          } = resultText;

          let newWidth = Math.abs(nEndX - nStartX);
          let newHeight = Math.abs(nEndY - nStartY);

          const MIN_WIDTH = 60;
          const MIN_HEIGHT = 20;

          if (newWidth < MIN_WIDTH || newHeight < MIN_HEIGHT) break;
          newWidth = Math.max(newWidth, newHeight);
          newHeight = Math.max(newHeight, newWidth);

          const PADDING = 8;
          let newFontSize = shape.fontSize;
          let textDimensions = measureText(
            shape.text,
            newFontSize,
            shape.fontFamily
          );

          const targetWidth = newWidth - PADDING * 2;
          const targetHeight = newHeight - PADDING * 2;
          if (
            textDimensions.width > targetWidth ||
            textDimensions.height > targetHeight
          ) {
            const scaleX = targetWidth / textDimensions.width;
            const scaleY = targetHeight / textDimensions.height;
            const scale = Math.min(scaleX, scaleY);
            newFontSize = Math.max(8, Math.round(newFontSize * scale));
            textDimensions = measureText(
              shape.text,
              newFontSize,
              shape.fontFamily
            );
          } else {
            const scaleX = targetWidth / textDimensions.width;
            newFontSize = Math.min(200, Math.round(newFontSize * scaleX));
            textDimensions = measureText(
              shape.text,
              newFontSize,
              shape.fontFamily
            );
            if (textDimensions.height > targetHeight) {
              const scaleY = targetHeight / textDimensions.height;
              newFontSize = Math.max(8, Math.round(newFontSize * scaleY));
              textDimensions = measureText(
                shape.text,
                newFontSize,
                shape.fontFamily
              );
            }
          }

          let finalStartX = nStartX;
          let finalStartY = nStartY;
          let finalEndX = nEndX;
          let finalEndY = nEndY;

          switch (resizeHandle) {
            case "nw":
              finalStartX = shape.endX - newWidth;
              finalStartY = shape.endY - newHeight;
              break;
            case "ne":
              finalEndX = shape.startX + newWidth;
              finalStartY = shape.endY - newHeight;
              break;
            case "sw":
              finalStartX = shape.endX - newWidth;
              finalEndY = shape.startY + newHeight;
              break;
            case "se":
              finalEndX = shape.startX + newWidth;
              finalEndY = shape.startY + newHeight;
              break;
            default:
              const centerX = (shape.startX + shape.endX) / 2;
              const centerY = (shape.startY + shape.endY) / 2;
              finalStartX = centerX - newWidth / 2;
              finalStartY = centerY - newHeight / 2;
              finalEndX = centerX + newWidth / 2;
              finalEndY = centerY + newHeight / 2;
              break;
          }

          shape.startX = finalStartX;
          shape.startY = finalStartY;
          shape.endX = finalEndX;
          shape.endY = finalEndY;
          shape.fontSize = newFontSize;
          shape.x = finalStartX + PADDING;
          shape.y = finalStartY + PADDING;
          break;
        default:
          break;
      }
      const newShapes = shapesToBeChosen.map((s) =>
        s.id === selectedShapeId ? shape : s
      );
      if (!isConnected) onSetCanvaShapes([...newShapes]);
      if (isConnected)
        sendEncryptedMessage(shape, ClientEvents.Encryption, true, false);
      setDragStart(pos);
    } else if (isDragging && tooltype === ToolType.Grab) {
      const pos = getMousePos(e);
      const deltaX = pos.x - dragStart.x;
      const deltaY = pos.y - dragStart.y;
      setCanvasState((prev) => ({
        ...prev,
        panX: prev.panX + deltaX,
        panY: prev.panY + deltaY,
      }));
      expandCanvasForPanning();
    } else if (
      isDragging &&
      selectedShapeId != null &&
      tooltype === ToolType.Select
    ) {
      let updatedShapes = shapesToBeChosen;
      const draggingShape = shapesToBeChosen.find(
        (s) => s.id === selectedShapeId
      )!;
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;
      switch (draggingShape.type) {
        case ToolType.Rectangle:
        case ToolType.Ellipse:
        case ToolType.Diamond:
        case ToolType.Line:
        case ToolType.Arrow:
        case ToolType.Pencil:
        case ToolType.Text:
          const shape = draggingShape;
          let updatedShape = {
            ...shape,
            startX: shape.startX + dx,
            startY: shape.startY + dy,
            endX: shape.endX + dx,
            endY: shape.endY + dy,
          };
          if (shape.type === ToolType.Line || shape.type === ToolType.Arrow) {
            updatedShape = {
              ...shape,
              startX: shape.startX + dx,
              startY: shape.startY + dy,
              endX: shape.endX + dx,
              endY: shape.endY + dy,
              sX: shape.sX + dx,
              sY: shape.sY + dy,
              mX: shape.mX + dx,
              mY: shape.mY + dy,
              eX: shape.eX + dx,
              eY: shape.eY + dy,
            };
          }
          if (shape.type === ToolType.Pencil) {
            const updatedPoints = shape.points.map((point) => [
              point[0] + dx,
              point[1] + dy,
            ]) as [x: number, y: number][];
            updatedShape = {
              ...shape,
              startX: shape.startX + dx,
              startY: shape.startY + dy,
              endX: shape.endX + dx,
              endY: shape.endY + dy,
              points: updatedPoints,
            };
          }
          if (shape.type === ToolType.Text) {
            updatedShape = {
              ...shape,
              x: shape.x + dx,
              y: shape.y + dy,
              startX: shape.startX + dx,
              startY: shape.startY + dy,
              endX: shape.endX + dx,
              endY: shape.endY + dy,
            };
          }
          updatedShapes = shapesToBeChosen.map((s) =>
            s.id === selectedShapeId ? updatedShape : s
          )!;
          if (isConnected)
            sendEncryptedMessage(
              updatedShape,
              ClientEvents.Encryption,
              true,
              false
            );
          break;
        default:
          break;
      }
      onSetCanvaCursorType(CursorType.Crossmove);
      if (!isConnected) onSetCanvaShapes([...updatedShapes]);
      setDragStart(pos);
    } else if (isDrawing && currentShape) {
      let updatedShape: Shape | null = null;
      switch (tooltype) {
        case ToolType.Rectangle:
          updatedShape = {
            ...currentShape,
            type: ToolType.Rectangle,
            startX: Math.min(pos.x, dragStart.x),
            startY: Math.min(pos.y, dragStart.y),
            endX: Math.max(pos.x, dragStart.x),
            endY: Math.max(pos.y, dragStart.y),
            edgeType: canvaEdge,
            ...options,
          };
          setCurrentShape(updatedShape);
          break;
        case ToolType.Ellipse:
          updatedShape = {
            ...currentShape,
            type: ToolType.Ellipse,
            startX: Math.min(pos.x, dragStart.x),
            startY: Math.min(pos.y, dragStart.y),
            endX: Math.max(pos.x, dragStart.x),
            endY: Math.max(pos.y, dragStart.y),
            ...options,
          };
          setCurrentShape(updatedShape);
          break;
        case ToolType.Diamond:
          updatedShape = {
            ...currentShape,
            type: ToolType.Diamond,
            startX: Math.min(pos.x, dragStart.x),
            startY: Math.min(pos.y, dragStart.y),
            endX: Math.max(pos.x, dragStart.x),
            endY: Math.max(pos.y, dragStart.y),
            edgeType: canvaEdge,
            ...options,
          };
          setCurrentShape(updatedShape);
          break;
        case ToolType.Line:
          updatedShape = {
            ...currentShape,
            type: ToolType.Line,
            sX: dragStart.x,
            sY: dragStart.y,
            mX: (pos.x + dragStart.x) / 2,
            mY: (pos.y + dragStart.y) / 2,
            eX: pos.x,
            eY: pos.y,
            startX: Math.min(pos.x, dragStart.x),
            startY: Math.min(pos.y, dragStart.y),
            endX: Math.max(pos.x, dragStart.x),
            endY: Math.max(pos.y, dragStart.y),
            ...options,
          };
          setCurrentShape(updatedShape);
          break;
        case ToolType.Arrow:
          updatedShape = {
            ...currentShape,
            type: ToolType.Arrow,
            sX: dragStart.x,
            sY: dragStart.y,
            mX: (pos.x + dragStart.x) / 2,
            mY: (pos.y + dragStart.y) / 2,
            eX: pos.x,
            eY: pos.y,
            startX: Math.min(pos.x, dragStart.x),
            startY: Math.min(pos.y, dragStart.y),
            endX: Math.max(pos.x, dragStart.x),
            endY: Math.max(pos.y, dragStart.y),
            arrowType: canvaArrowType,
            ...options,
          };
          setCurrentShape(updatedShape);
          break;
        case ToolType.Pencil:
          updatedShape = currentShape;
          if (updatedShape && updatedShape.type === ToolType.Pencil) {
            let startX = updatedShape.startX;
            let startY = updatedShape.startY;
            let endX = updatedShape.endX;
            let endY = updatedShape.endY;
            updatedShape.points.forEach((point) => {
              startX = Math.min(startX, point[0]);
              startY = Math.min(startY, point[1]);
              endX = Math.max(endX, point[0]);
              endY = Math.max(endY, point[1]);
            });
            updatedShape = {
              ...updatedShape,
              startX,
              startY,
              endX,
              endY,
              points: [...updatedShape.points, [pos.x, pos.y]],
              ...options,
            };
          }
          setCurrentShape(updatedShape);
          break;
        default:
          break;
      }
      if (isConnected && updatedShape) {
        sendEncryptedMessage(
          updatedShape,
          ClientEvents.Encryption,
          true,
          false
        );
      }
    } else if (isDeleting) {
      let updatedCanvas = shapesToBeChosen;
      updatedCanvas = updatedCanvas.map((shape) => {
        let updatedShape = shape;
        if (canvasEngine?.isPointInshape(cursorPos, shape)) {
          updatedShape = {
            ...shape,
            isDeleted: true,
          };
        }
        if (isConnected && updatedShape.isDeleted)
          sendEncryptedMessage(
            updatedShape,
            ClientEvents.Encryption,
            false,
            true
          );
        return updatedShape;
      });
      if (!isConnected) onSetCanvaShapes([...updatedCanvas]);
    }
  };

  const handlePointUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (tooltype === ToolType.Grab) {
      onSetCanvaCursorType(CursorType.Grab);
      setIsDragging(false);
      return;
    }
    if (tooltype === ToolType.Eraser) {
      const updatedShapes = shapesToBeChosen.filter(
        (shape) => !shape.isDeleted
      );
      if (!isConnected) onSetCanvaShapes([...updatedShapes]);
      setIsDeleting(false);
      return;
    }
    if (tooltype === ToolType.Text) {
      handleMouseUp();
      setCurrentShape(null);
      return;
    }
    if (isDrawing && currentShape) {
      setSelectedShapeId(currentShape.id);
      if (!isConnected) onSetCanvaShapes([...shapesToBeChosen, currentShape]);
      setCurrentShape(null);
    }
    if (isResizing && selectedShapeId !== null) {
      let updatedShapes = shapesToBeChosen;
      const shape = shapesToBeChosen.find((s) => s.id === selectedShapeId)!;
      switch (shape.type) {
        case ToolType.Rectangle:
        case ToolType.Ellipse:
        case ToolType.Diamond:
        case ToolType.Pencil:
          const updatedShape = {
            ...shape,
            startX: Math.min(shape.startX, shape.endX),
            endX: Math.max(shape.startX, shape.endX),
            startY: Math.min(shape.startY, shape.endY),
            endY: Math.max(shape.endY, shape.startY),
          };
          if (isConnected)
            sendEncryptedMessage(
              updatedShape,
              ClientEvents.Encryption,
              true,
              false
            );
          updatedShapes = shapesToBeChosen.map((s) =>
            s.id === selectedShapeId ? updatedShape : s
          );
          break;
        case ToolType.Line:
        case ToolType.Arrow:
          const updatedLine = {
            ...shape,
            startX: Math.min(shape.sX, shape.mX, shape.eX),
            startY: Math.min(shape.sY, shape.mY, shape.eY),
            endX: Math.max(shape.sX, shape.mX, shape.eX),
            endY: Math.max(shape.sY, shape.mY, shape.eY),
          };
          if (isConnected)
            sendEncryptedMessage(
              updatedLine,
              ClientEvents.Encryption,
              true,
              false
            );
          updatedShapes = shapesToBeChosen.map((s) =>
            s.id === selectedShapeId ? updatedLine : s
          );
          break;
        default:
          break;
      }
      if (!isConnected) onSetCanvaShapes([...updatedShapes]);
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
    selectedShapeId,
    cursorPos,
  };
};
