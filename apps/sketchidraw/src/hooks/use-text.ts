"use client";

import { CanvasEngine } from "@/canvas-engine/canvas-engine";
import { ToolType } from "@/types/tools";
import { RefObject, useCallback, useEffect, useState } from "react";
import { useCanva } from "./use-canva-store";
import { Text } from "@/types/shape";
import { KeyTypes } from "@/constants";

type TextProps = {
  canvasEngine: CanvasEngine | null;
  canvasRef?: RefObject<HTMLCanvasElement | null>;
};

export const useText = ({ canvasEngine, canvasRef }: TextProps) => {
  const { canvas, tooltype } = useCanva();
  const [isEditing, setIsEditing] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [textObjects, setTextObjects] = useState<Text[]>([]);
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);

  const createTextObject = useCallback(
    (x: number, y: number, text: string = ""): Text => ({
      type: ToolType.Text,
      id: (Date.now() + Math.random()).toString(),
      x,
      y,
      text,
      fontSize: 25,
      fontFamily: "Arial",
      color: "#ffffff",
      lineHeight: 1.2,
    }),
    []
  );

  const getMousePos = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.top,
        y: e.clientY - rect.left,
      };
    },
    [canvas]
  );

  const getTextMetrics = useCallback(
    (textObj: Text) => {
      const canvas = canvasRef?.current;
      if (!canvas) return { lines: [], width: 0, height: 0 };

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.font = `${textObj.fontSize}px ${textObj.fontFamily}`;
      const lines = textObj.text.split("\n");
      const lineHeight = textObj.fontSize * textObj.lineHeight;
      const measuredLines = lines.map((line) => ({
        text: line,
        width: ctx.measureText(line).width,
        height: lineHeight,
      }));

      const maxWidth = Math.max(...measuredLines.map((l) => l.width));
      const totalHeight = measuredLines.length * lineHeight;

      return {
        lines,
        width: maxWidth,
        height: totalHeight,
        lineHeight,
      };
    },
    [canvasRef]
  );

  const getTextIndexFromCoordinates = useCallback(
    (textObj: Text, mouseX: number, mouseY: number) => {
      const canvas = canvasRef?.current;
      if (!canvas) return 0;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.font = `${textObj.fontSize}px ${textObj.fontFamily}`;

      const lines = textObj.text.split("\n");
      const lineHeight = textObj.fontSize * textObj.lineHeight;

      const lineIndex = Math.max(
        0,
        Math.min(
          Math.floor((mouseY - textObj.y) / lineHeight),
          lines.length - 1
        )
      );

      const line = lines[lineIndex];
      const relativeX = mouseX - textObj.x;

      let charIndex = 0;

      for (let i = 0; i < line.length; i++) {
        const nextWidth = ctx.measureText(line.substring(0, i)).width;
        if (nextWidth > relativeX) {
          charIndex = i - 1;
          break;
        }
        charIndex = i;
      }

      let totalIndex = 0;
      for (let i = 0; i < lineIndex; i++) {
        totalIndex += lines[i].length + 1;
      }

      totalIndex += Math.max(0, charIndex);

      return Math.min(totalIndex, textObj.text.length);
    },
    [canvasRef]
  );

  const getCursorCoordinates = useCallback(
    (textObj: Text, textIndex: number) => {
      const canvas = canvasRef?.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return { x: textObj.x, y: textObj.y };

      ctx.font = `${textObj.fontSize}px ${textObj.fontFamily}`;

      const lines = textObj.text.split("\n");
      const lineHeight = textObj.fontSize * textObj.lineHeight;
      let currentIndex = 0;
      let lineIndex = 0;
      let charIndex = 0;

      for (let i = 0; i < lines.length; i++) {
        if (currentIndex + lines[i].length >= textIndex) {
          lineIndex = i;
          charIndex = textIndex - currentIndex;
          break;
        }
        currentIndex += lines[i].length + 1;
      }

      const textBeforeCursor = lines[lineIndex].substring(0, charIndex);
      const x = textObj.x + ctx.measureText(textBeforeCursor).width;
      const y = textObj.y + lineIndex * lineHeight;

      return { x, y };
    },
    [canvasRef]
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef?.current;
      if (!canvas) return;
      const pos = getMousePos(e);

      let clickedText = null;

      for (let i = textObjects.length - 1; i >= 0; i--) {
        const textObj = textObjects[i];
        const metrics = getTextMetrics(textObj);

        if (
          pos.x >= textObj.x &&
          pos.x <= textObj.x + (metrics?.width ?? 0) &&
          pos.y >= textObj.y &&
          pos.y <= textObj.y + (metrics?.height ?? 0)
        ) {
          clickedText = textObj;
          break;
        }
      }
      if (clickedText) {
        setActiveTextId(clickedText.id);
        setIsEditing(true);
        const textIndex = getTextIndexFromCoordinates(
          clickedText,
          pos.x,
          pos.y
        );
        setCursorPosition(textIndex ?? 0);
      } else {
        const newText = createTextObject(pos.x, pos.y, "");
        setTextObjects((prev) => [...prev, newText]);
        setActiveTextId(newText.id);
        setCursorPosition(0);
      }
      setIsEditing(true);
      setShowCursor(true);
      setSelectionStart(null);
      setSelectionEnd(null);
    },
    [
      canvasRef,
      getMousePos,
      getTextMetrics,
      getTextIndexFromCoordinates,
      createTextObject,
      textObjects,
    ]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (tooltype !== ToolType.Text) return;
      if (!isEditing || activeTextId === null) {
        handleCanvasClick(e);
        return;
      }

      const canvas = canvasRef?.current;
      if (!canvas) return;

      const pos = getMousePos(e);

      const activeText = textObjects.find((t) => t.id === activeTextId);
      if (activeText) {
        const textIndex = getTextIndexFromCoordinates(activeText, pos.x, pos.y);
        setCursorPosition(textIndex ?? 0);
        setSelectionStart(textIndex ?? null);
        setSelectionEnd(textIndex ?? null);
      }
    },
    [
      tooltype,
      handleCanvasClick,
      activeTextId,
      isEditing,
      canvasRef,
      getMousePos,
      getTextIndexFromCoordinates,
      textObjects,
    ]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (tooltype !== ToolType.Text) return;
      if (!isEditing || activeTextId === null || selectionStart === null)
        return;

      const canvas = canvasRef?.current;
      if (!canvas) return;

      const pos = getMousePos(e);

      const activeText = textObjects.find((t) => t.id === activeTextId);
      if (activeText) {
        const textIndex = getTextIndexFromCoordinates(activeText, pos.x, pos.y);
        setSelectionEnd(textIndex ?? null);
        setCursorPosition(textIndex ?? 0);
      }
    },
    [
      tooltype,
      activeTextId,
      textObjects,
      getTextIndexFromCoordinates,
      isEditing,
      canvasRef,
      setSelectionEnd,
      getMousePos,
      selectionStart,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (tooltype !== ToolType.Text) return;

    if (
      selectionStart !== null &&
      selectionEnd !== null &&
      selectionStart === selectionEnd
    ) {
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  }, [tooltype, selectionStart, selectionEnd]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (!isEditing || activeTextId === null || tooltype !== ToolType.Text)
        return;

      const activeText = textObjects.find((t) => t.id === activeTextId);
      if (!activeText) return;
      let newText = activeText.text;
      let newCursor = cursorPosition;
      let newSelectStart = selectionStart;
      let newSelectEnd = selectionEnd;

      const hasSelection =
        selectionStart !== null &&
        selectionEnd !== null &&
        selectionStart !== selectionEnd;

      switch (e.key) {
        case KeyTypes.ArrowLeft:
          if (e.shiftKey) {
            if (selectionStart === null) {
              setSelectionStart(cursorPosition);
              setSelectionEnd(Math.max(0, cursorPosition - 1));
            } else {
              setSelectionEnd(Math.max(0, (selectionEnd ?? 0) - 1));
            }
            setCursorPosition(Math.max(0, cursorPosition - 1));
          } else {
            if (hasSelection) {
              newCursor = Math.min(selectionStart, selectionEnd);
            } else {
              newCursor = Math.max(0, cursorPosition - 1);
            }
            setCursorPosition(newCursor);
            setSelectionStart(null);
            setSelectionEnd(null);
          }
          break;
        case KeyTypes.ArrowRight:
          if (e.shiftKey) {
            if (selectionStart === null) {
              setSelectionStart(cursorPosition);
              setSelectionEnd(Math.min(newText.length, cursorPosition + 1));
            } else {
              setSelectionEnd(
                Math.min(newText.length, (selectionEnd ?? 0) + 1)
              );
            }
            setCursorPosition(Math.min(newText.length, cursorPosition + 1));
          } else {
            if (hasSelection) {
              newCursor = Math.max(selectionStart, selectionEnd);
            } else {
              newCursor = Math.min(newText.length, cursorPosition + 1);
            }
            setCursorPosition(newCursor);
            setSelectionStart(null);
            setSelectionEnd(null);
          }
          break;
        case KeyTypes.ArrowUp:
        case KeyTypes.ArrowDown:
          const lines = newText.split("\n");
          let currentLine = 0;
          let currentColumn = 0;
          let index = 0;

          for (let i = 0; i < lines.length; i++) {
            if (index + lines[i].length >= cursorPosition) {
              currentLine = i;
              currentColumn = cursorPosition - index;
              break;
            }
            index += lines[i].length + 1;
          }

          const targetLine =
            e.key === KeyTypes.ArrowUp
              ? Math.max(0, currentLine - 1)
              : Math.min(lines.length - 1, currentLine + 1);

          if (targetLine !== currentLine) {
            let targetIndex = 0;
            for (let i = 0; i < targetLine; i++) {
              targetIndex += lines[i].length + 1;
            }
            targetIndex += Math.min(currentColumn, lines[targetLine].length);
            if (e.shiftKey) {
              if (selectionStart === null) {
                setSelectionStart(cursorPosition);
              }
              setSelectionEnd(targetIndex);
            } else {
              setSelectionStart(null);
              setSelectionEnd(null);
            }
            setCursorPosition(targetIndex);
          }
          break;
        case KeyTypes.Home:
          const lines2 = newText.split("\n");
          let currentLine2 = 0;
          let index2 = 0;

          for (let i = 0; i < lines2.length; i++) {
            if (index2 + lines2[i].length >= cursorPosition) {
              currentLine2 = i;
              break;
            }
            index2 += lines2[i].length + 1;
          }

          let lineStartIndex = 0;
          for (let i = 0; i < currentLine2; i++) {
            lineStartIndex += lines2[i].length + 1;
          }

          if (e.shiftKey) {
            if (selectionStart === null) {
              setSelectionStart(cursorPosition);
            }
            setSelectionEnd(lineStartIndex);
          } else {
            setSelectionStart(null);
            setSelectionEnd(null);
          }
          setCursorPosition(lineStartIndex);
          break;
        case KeyTypes.End:
          const lines3 = newText.split("\n");
          let currentLine3 = 0;
          let index3 = 0;

          for (let i = 0; i < lines3.length; i++) {
            if (index3 + lines3[i].length >= cursorPosition) {
              currentLine3 = i;
              break;
            }
            index3 += lines3[i].length + 1;
          }

          let lineEndIndex = 0;
          for (let i = 0; i <= currentLine3; i++) {
            lineEndIndex += lines3[i].length + (i < lines3.length - 1 ? 1 : 0);
          }

          if (e.shiftKey) {
            if (selectionStart === null) {
              setSelectionStart(cursorPosition);
            }
            setSelectionEnd(lineEndIndex);
          } else {
            setSelectionStart(null);
            setSelectionEnd(null);
          }
          setCursorPosition(lineEndIndex);
          break;
        case KeyTypes.Delete:
          if (hasSelection) {
            const start = Math.min(selectionStart, selectionEnd);
            const end = Math.max(selectionStart, selectionEnd);
            newText = newText.substring(0, start) + newText.substring(end);
            newCursor = start;
            newSelectStart = null;
            newSelectEnd = null;
          } else if (cursorPosition < newText.length) {
            newText =
              newText.substring(0, cursorPosition) +
              newText.substring(cursorPosition + 1);
          }
          break;
          break;
        case KeyTypes.Enter:
          if (hasSelection) {
            const start = Math.min(selectionStart, selectionEnd);
            const end = Math.max(selectionStart, selectionEnd);
            newText =
              newText.substring(0, start) + "\n" + newText.substring(end);
            newCursor = start + 1;
            newSelectStart = null;
            newSelectEnd = null;
          } else {
            newText =
              newText.substring(0, cursorPosition) +
              "\n" +
              newText.substring(cursorPosition);
            newCursor = cursorPosition + 1;
          }
          break;
        case KeyTypes.Backspace:
          if (hasSelection) {
            const start = Math.min(selectionEnd, selectionStart);
            const end = Math.max(selectionStart, selectionEnd);
            newText = newText.substring(0, start) + newText.substring(end);
            newCursor = start;
            newSelectStart = null;
            newSelectEnd = null;
          } else if (cursorPosition > 0) {
            newText =
              newText.substring(0, cursorPosition - 1) +
              newText.substring(cursorPosition);
            newCursor = cursorPosition - 1;
          }
          break;
        case KeyTypes.Escape:
          setIsEditing(false);
          setActiveTextId(null);
          setSelectionStart(null);
          setSelectionEnd(null);
          return;
        default:
          if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
            if (hasSelection) {
              const start = Math.min(selectionEnd, selectionStart);
              const end = Math.min(selectionEnd, selectionStart);
              newText =
                newText.substring(0, start) + e.key + newText.substring(end);
              newCursor = start + 1;
              newSelectStart = null;
              newSelectEnd = null;
            } else {
              newText =
                newText.substring(0, cursorPosition) +
                e.key +
                newText.substring(cursorPosition!);
              newCursor = cursorPosition! + 1;
            }
          }
          break;
      }

      if (
        newText !== activeText.text ||
        newCursor !== cursorPosition ||
        newSelectStart !== selectionStart ||
        newSelectEnd !== selectionEnd
      ) {
        setTextObjects((prev) =>
          prev.map((t) => (t.id === activeTextId ? { ...t, text: newText } : t))
        );
        setCursorPosition(newCursor);
        setSelectionStart(newSelectStart);
        setSelectionEnd(newSelectEnd);
      }
      setShowCursor(true);
    },
    [
      activeTextId,
      cursorPosition,
      isEditing,
      selectionEnd,
      selectionStart,
      textObjects,
      tooltype,
    ]
  );

  useEffect(() => {
    if (canvasEngine) {
      canvasEngine.redrawShapes(null);
      const texts = textObjects.filter((t) => t.type === ToolType.Text);
      texts.forEach((txt) => {
        canvasEngine.renderText(
          txt,
          activeTextId,
          selectionStart,
          selectionEnd,
          isEditing,
          cursorPosition,
          showCursor,
          getCursorCoordinates
        );
      });
    }
  }, [
    canvasEngine,
    textObjects,
    activeTextId,
    selectionStart,
    selectionEnd,
    isEditing,
    cursorPosition,
    showCursor,
    getCursorCoordinates,
  ]);

  useEffect(() => {
    const hiddenInput = document.createElement("input");
    hiddenInput.style.position = "absolute";
    hiddenInput.style.left = "-9999px";
    hiddenInput.style.opacity = "0";
    hiddenInput.style.pointerEvents = "none";
    hiddenInput.setAttribute("data-vimium-disable", "true");
    hiddenInput.id = "text-tool-hidden-input";

    document.body.appendChild(hiddenInput);

    return () => {
      document.body.removeChild(hiddenInput);
    };
  }, []);

  useEffect(() => {
    if (!isEditing || tooltype !== ToolType.Text) return;

    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    const hiddenInput = document.getElementById("text-tool-hidden-input");
    if (hiddenInput) {
      hiddenInput.focus();
      hiddenInput.addEventListener("keydown", handleKeyDown);
    }

    document.addEventListener("keydown", handleKeyDown, {
      capture: true,
      passive: false,
    });

    return () => {
      if (hiddenInput) {
        hiddenInput.removeEventListener("keydown", handleKeyDown);
      }
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      clearInterval(interval);
    };
  }, [isEditing, tooltype, handleKeyDown]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
