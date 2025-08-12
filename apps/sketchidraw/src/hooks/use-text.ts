"use client";

import { CanvasEngine } from "@/canvas-engine/canvas-engine";
import { Text } from "@/types/shape";
import { ToolType } from "@/types/tools";
import { RefObject, useCallback, useEffect, useState } from "react";
import { useCanva } from "./use-canva-store";

type TextProps = {
  canvasEngine: CanvasEngine | null;
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

export const useText = ({ canvasEngine, canvasRef }: TextProps) => {
  const { canvas, tooltype, canvaShapes, onSetCanvaShapes } = useCanva();
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [currentText, setCurrentText] = useState<Text | null>(null);
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.top,
      y: e.clientY - rect.left,
    };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!canvasRef.current || tooltype !== ToolType.Text) return;
    const pos = getMousePos(e);

    if (isTyping && currentText) {
      const newCanvaShapes = [...canvaShapes, currentText];
      onSetCanvaShapes(newCanvaShapes);
    }

    setCursorPosition({ x: pos.x, y: pos.y });
    setIsTyping(true);
    setCurrentText({
      type: tooltype,
      texts: [
        {
          x: pos.x,
          y: pos.y,
          text: "",
        },
      ],
    });
    setShowCursor(true);
    canvasRef.current?.focus();
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (e.key === "Enter") {
        setCurrentText((prev) => {
          if (prev === null || cursorPosition === null) return null;
          const newText = {
            x: cursorPosition.x,
            y: cursorPosition.y + 30,
            text: "",
          };
          return {
            ...prev,
            texts: [...prev.texts, newText],
          };
        });
        setCursorPosition((prev) => {
          if (prev === null) return null;
          return {
            x: prev.x,
            y: prev.y + 30,
          };
        });
      } else if (e.key.length === 1) {
        setCurrentText((prev) => {
          if (prev === null || cursorPosition === null) return prev;
          const updatedTexts = prev.texts.map((t) => {
            if (t.x === cursorPosition.x && t.y === cursorPosition.y) {
              return {
                x: t.x,
                y: t.y,
                text: t.text + e.key,
              };
            }
            return t;
          });
          return {
            ...prev,
            texts: updatedTexts,
          };
        });
      }
    },
    [cursorPosition]
  );

  useEffect(() => {
    if (canvasEngine) {
      canvasEngine.redrawShapes(null);

      if (currentText) {
        canvasEngine.drawShape(currentText);
      }

      if (isTyping && showCursor && cursorPosition) {
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;
        let textWidth = 0;
        if (currentText) {
          const text = currentText.texts.find(
            (t) => t.x === cursorPosition.x && t.y === cursorPosition.y
          );
          textWidth = ctx.measureText(text?.text ?? "").width;
        }
        const cursorX = cursorPosition.x + textWidth;
        const cursorY = cursorPosition.y;

        // Draw cursor line
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cursorX, cursorY - 30);
        ctx.lineTo(cursorX, cursorY + 4);
        ctx.stroke();
      }
    }
  }, [canvasEngine, currentText, isTyping, showCursor, cursorPosition, canvas]);

  useEffect(() => {
    if (!isTyping || tooltype !== ToolType.Text) return;

    const blinkInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    const hiddenInput = document.createElement("input");
    hiddenInput.style.position = "absolute";
    hiddenInput.style.left = "-9999px";
    hiddenInput.style.opacity = "0";
    hiddenInput.style.pointerEvents = "none";
    hiddenInput.setAttribute("data-vimium-disable", "true");

    document.body.appendChild(hiddenInput);
    hiddenInput.focus();

    hiddenInput.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleKeyDown, {
      capture: true,
      passive: false,
    });

    return () => {
      document.body.removeChild(hiddenInput);
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      clearInterval(blinkInterval);
    };
  }, [isTyping, tooltype, handleKeyDown]);

  return {
    handleCanvasClick,
  };
};
