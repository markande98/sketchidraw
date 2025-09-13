"use client";

import { v4 as uuidv4 } from "uuid";
import { ClientEvents, KeyTypes } from "@/constants";
import { Shape, Text } from "@/types/shape";
import { ToolType } from "@/types/tools";
import { RefObject, useCallback, useEffect, useState } from "react";
import { useCanva } from "./use-canva-store";
import { getFontCSS } from "@/lib/utils";
import { CanvasEngine } from "@/canvas-engine/canvas-engine";

type TextProps = {
  canvasEngine: CanvasEngine | null;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  panX: number;
  panY: number;
  selectedShapeId: string | null;
  isConnected: boolean;
  newShapes: Shape[];
  sendEncryptedMessage: (
    shape: Shape,
    type: ClientEvents,
    toBeAdded: boolean,
    toBeDeleted: boolean
  ) => void;
};

export const useText = ({
  canvasRef,
  canvasEngine,
  panX,
  panY,
  selectedShapeId,
  isConnected,
  sendEncryptedMessage,
  newShapes,
}: TextProps) => {
  const {
    tooltype,
    canvasScale,
    canvaFontSize,
    canvaStrokeColor,
    canvaFontFamily,
    canvaShapes,
    onSetCanvaShapes,
  } = useCanva();
  const [isEditing, setIsEditing] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [lastTypingTime, setLastTypingTime] = useState<number>(0);
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);

  const selectedShapes = isConnected ? newShapes : canvaShapes;

  const textObjects = selectedShapes.filter(
    (shape) => shape.type === ToolType.Text
  );
  const shapes = selectedShapes.filter((shape) => shape.type !== ToolType.Text);

  const createTextObject = useCallback(
    (x: number, y: number, text: string = ""): Text => ({
      type: ToolType.Text,
      id: uuidv4(),
      isDeleted: false,
      x,
      y,
      startX: x,
      startY: y,
      endX: x,
      endY: y,
      text,
      fontSize: canvaFontSize,
      fontFamily: getFontCSS(canvaFontFamily),
      color: canvaStrokeColor,
      lineHeight: 1.2,
    }),
    [canvaFontSize, canvaStrokeColor, canvaFontFamily]
  );

  const getMousePos = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvasElement =
        canvasRef.current || (e.target as HTMLCanvasElement);
      if (!canvasElement) return { x: 0, y: 0 };
      const rect = canvasElement.getBoundingClientRect();

      const scaleX = canvasElement.offsetWidth / canvasElement.scrollWidth;
      const scaleY = canvasElement.offsetHeight / canvasElement.scrollHeight;

      return {
        x: ((e.clientX - rect.left) / scaleX - panX) / canvasScale,
        y: ((e.clientY - rect.top) / scaleY - panY) / canvasScale,
      };
    },
    [canvasRef, canvasScale, panX, panY]
  );

  const getTextMetrics = useCallback(
    (textObj: Text) => {
      const canvas = canvasRef?.current;
      if (!canvas) return { lines: [], width: 0, height: 0 };

      const ctx = canvas.getContext("2d");
      if (!ctx) return { lines: [], width: 0, height: 0 };
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
      if (!ctx) return 0;
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

      for (let i = 0; i <= line.length; i++) {
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
      if (tooltype !== ToolType.Text) {
        return;
      }
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
        setCursorPosition(textIndex);
      } else {
        const newText = createTextObject(pos.x, pos.y, "");
        if (isConnected)
          sendEncryptedMessage(newText, ClientEvents.Encryption, true, false);
        else onSetCanvaShapes([...shapes, ...textObjects, newText]);
        setActiveTextId(newText.id);
        setIsEditing(true);
        setCursorPosition(0);
      }
      setShowCursor(true);
      setSelectionStart(null);
      setSelectionEnd(null);
    },
    [
      tooltype,
      canvasRef,
      getMousePos,
      textObjects,
      getTextMetrics,
      getTextIndexFromCoordinates,
      createTextObject,
      isConnected,
      sendEncryptedMessage,
      onSetCanvaShapes,
      shapes,
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

      const isInsideAnyText = textObjects.find((textObj) => {
        const metrics = getTextMetrics(textObj);
        if (
          pos.x >= textObj.x &&
          pos.x <= textObj.x + (metrics?.width ?? 0) &&
          pos.y >= textObj.y &&
          pos.y <= textObj.y + (metrics?.height ?? 0)
        )
          return textObj;
      });

      if (!isInsideAnyText) {
        handleCanvasClick(e);
        return;
      }
      const textIndex = getTextIndexFromCoordinates(
        isInsideAnyText,
        pos.x,
        pos.y
      );
      setActiveTextId(isInsideAnyText.id);
      setCursorPosition(textIndex ?? 0);
      setSelectionStart(textIndex ?? null);
      setSelectionEnd(textIndex ?? null);
    },
    [
      tooltype,
      isEditing,
      activeTextId,
      canvasRef,
      getMousePos,
      textObjects,
      getTextIndexFromCoordinates,
      handleCanvasClick,
      getTextMetrics,
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
      isEditing,
      activeTextId,
      selectionStart,
      canvasRef,
      getMousePos,
      textObjects,
      getTextIndexFromCoordinates,
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
      if (!isEditing || activeTextId === null || tooltype !== ToolType.Text)
        return;

      setLastTypingTime(Date.now());
      setShowCursor(true);

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

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
        const updatedTextObjects = textObjects.map((t) => {
          if (t.id === activeTextId) {
            const metrics = getTextMetrics(t);
            const endX = t.startX + (metrics?.width ?? 0);
            const endY = t.startY + (metrics?.height ?? 0);
            const updatedText = { ...t, text: newText, endX, endY };
            if (isConnected)
              sendEncryptedMessage(
                updatedText,
                ClientEvents.Encryption,
                true,
                false
              );
            return {
              ...t,
              text: newText,
              endX,
              endY,
            };
          }
          return t;
        });
        if (!isConnected) onSetCanvaShapes([...shapes, ...updatedTextObjects]);
        setCursorPosition(newCursor);
        setSelectionStart(newSelectStart);
        setSelectionEnd(newSelectEnd);

        // IMMEDIATE RENDER: Force immediate re-render with cursor visible
        if (canvasEngine) {
          setTimeout(() => {
            canvasEngine.redrawShapes(
              selectedShapeId,
              canvasScale,
              panX,
              panY,
              isConnected,
              isConnected ? newShapes : [...shapes, ...updatedTextObjects]
            );

            const updatedText = updatedTextObjects.find(
              (t) => t.id === activeTextId
            );
            if (updatedText) {
              canvasEngine.renderText(
                updatedText,
                canvasScale,
                panX,
                panY,
                activeTextId,
                newSelectStart,
                newSelectEnd,
                isEditing,
                newCursor,
                true, // Force cursor visible
                getCursorCoordinates
              );
            }
          }, 0); // Execute on next tick to ensure state is updated
        }
      }
    },
    [
      activeTextId,
      canvasEngine,
      canvasScale,
      cursorPosition,
      getCursorCoordinates,
      getTextMetrics,
      isConnected,
      isEditing,
      newShapes,
      onSetCanvaShapes,
      panX,
      panY,
      selectedShapeId,
      selectionEnd,
      selectionStart,
      sendEncryptedMessage,
      shapes,
      textObjects,
      tooltype,
    ]
  );

  useEffect(() => {
    if (
      !isEditing ||
      tooltype !== ToolType.Text ||
      activeTextId === null ||
      !canvasEngine
    )
      return;
    canvasEngine.redrawShapes(
      selectedShapeId,
      canvasScale,
      panX,
      panY,
      isConnected,
      selectedShapes
    );
    const text = selectedShapes.find(
      (shape) => shape.type === ToolType.Text && shape.id === activeTextId
    ) as Text;

    if (text) {
      canvasEngine.renderText(
        text,
        canvasScale,
        panX,
        panY,
        activeTextId,
        selectionStart,
        selectionEnd,
        isEditing,
        cursorPosition,
        showCursor, // This will trigger re-render when showCursor changes
        getCursorCoordinates
      );
    }
  }, [
    showCursor,
    isEditing,
    tooltype,
    canvasScale,
    activeTextId,
    canvasEngine,
    selectionStart,
    selectionEnd,
    cursorPosition,
    getCursorCoordinates,
    panX,
    panY,
    selectedShapeId,
    isConnected,
    selectedShapes,
  ]);
  useEffect(() => {
    if (!isEditing || tooltype !== ToolType.Text || activeTextId === null) {
      return;
    }
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastTypingTime < 1000) {
        setShowCursor(true);
      } else setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [isEditing, tooltype, activeTextId, lastTypingTime]);

  useEffect(() => {
    if (!isEditing || tooltype !== ToolType.Text || activeTextId === null) {
      return;
    }

    const hiddenInput = document.createElement("input");
    hiddenInput.style.position = "absolute";
    hiddenInput.style.left = "-9999px";
    hiddenInput.style.opacity = "0";
    hiddenInput.style.pointerEvents = "none";
    hiddenInput.setAttribute("data-vimium-disable", "true");
    hiddenInput.id = "text-tool-hidden-input";

    const isSystemShortcut = (e: KeyboardEvent): boolean => {
      // Chrome DevTools shortcuts
      if ((e.metaKey || e.ctrlKey) && e.altKey && e.key === "j") return true; // Option/Alt + Cmd/Ctrl + J
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "I") return true; // Cmd/Ctrl + Shift + I
      if (e.key === "F12") return true; // F12

      // Browser shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === "r") return true; // Refresh
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "R") return true; // Hard refresh
      if ((e.metaKey || e.ctrlKey) && e.key === "w") return true; // Close tab
      if ((e.metaKey || e.ctrlKey) && e.key === "t") return true; // New tab
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "T") return true; // Reopen closed tab
      if ((e.metaKey || e.ctrlKey) && e.key === "n") return true; // New window
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "N") return true; // New incognito window
      if ((e.metaKey || e.ctrlKey) && e.key === "l") return true; // Focus address bar
      if ((e.metaKey || e.ctrlKey) && e.key === "d") return true; // Bookmark page
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "Delete")
        return true; // Clear browsing data

      // Navigation shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === "[") return true; // Back
      if ((e.metaKey || e.ctrlKey) && e.key === "]") return true; // Forward
      if (e.key === "F5") return true; // Refresh
      if (e.ctrlKey && e.key === "F5") return true; // Hard refresh

      // Zoom shortcuts
      if ((e.metaKey || e.ctrlKey) && (e.key === "+" || e.key === "="))
        return true; // Zoom in
      if ((e.metaKey || e.ctrlKey) && e.key === "-") return true; // Zoom out
      if ((e.metaKey || e.ctrlKey) && e.key === "0") return true; // Reset zoom

      // Tab navigation
      if ((e.metaKey || e.ctrlKey) && e.key >= "1" && e.key <= "9") return true; // Switch to tab
      if ((e.metaKey || e.ctrlKey) && e.key === "Tab") return true; // Next tab
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "Tab")
        return true; // Previous tab

      // System shortcuts (Mac)
      if (e.metaKey && e.key === " ") return true; // Spotlight
      if (e.metaKey && e.key === "Tab") return true; // App switcher
      if (e.metaKey && e.shiftKey && e.key === "Tab") return true; // Reverse app switcher
      if (e.metaKey && e.key === "q") return true; // Quit app
      if (e.metaKey && e.key === "h") return true; // Hide app
      if (e.metaKey && e.altKey && e.key === "h") return true; // Hide others
      if (e.metaKey && e.key === "m") return true; // Minimize

      // System shortcuts (Windows/Linux)
      if (e.altKey && e.key === "F4") return true; // Close window
      if (e.altKey && e.key === "Tab") return true; // Alt+Tab
      if (e.ctrlKey && e.altKey && e.key === "Delete") return true; // Task manager
      if (e.key === "F11") return true; // Fullscreen

      // Allow browser find
      if ((e.metaKey || e.ctrlKey) && e.key === "f") return true; // Find
      if ((e.metaKey || e.ctrlKey) && e.key === "g") return true; // Find next
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "G") return true; // Find previous

      return false;
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isSystemShortcut(e)) {
        return;
      }
      if (isEditing && tooltype === ToolType.Text && activeTextId) {
        handleKeyDown(e);
      }
    };

    document.body.appendChild(hiddenInput);
    hiddenInput.focus();
    hiddenInput.addEventListener("keydown", handleGlobalKeyDown);
    document.addEventListener("keydown", handleGlobalKeyDown, {
      capture: true,
      passive: false,
    });

    return () => {
      if (document.body.contains(hiddenInput)) {
        document.body.removeChild(hiddenInput);
      }
      hiddenInput.removeEventListener("keydown", handleGlobalKeyDown);
      document.removeEventListener("keydown", handleGlobalKeyDown, {
        capture: true,
      });
    };
  }, [isEditing, tooltype, activeTextId, handleKeyDown]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
