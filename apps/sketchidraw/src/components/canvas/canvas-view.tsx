"use client";

import { ToolsMenu } from "./tools-menu";
import { CanvasBoard } from "./canvas-board";
import { CanvasProperty } from "../canvas-property";
import { CanvasMenu } from "./canvas-Menu";
import { CanvaZoom } from "../canva-zoom";
import { useInfiniteCanvas } from "@/hooks/use-infinite-canvas";
import { useCallback, useEffect, useRef, useState } from "react";
import { WelcomeScreen } from "../welcome-screen";
import { useCanva } from "@/hooks/use-canva-store";
import { ToolType } from "@/types/tools";
import { saveToLocalStorage } from "@/lib/utils";
import { Shape } from "@/types/shape";
import { CanvaClearModal } from "./canva-clear-modal";
import { CanvaCollabModal } from "./canva-collab-modal";
import { CanvaModalType } from "@/constants";
import { CanvaShareModal } from "./canva-share-modal";

export const CanvasView = () => {
  const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(
    null
  );
  const { tooltype, canvaShapes, onSetCanvaShapes, onOpen } = useCanva();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    expandCanvasForPanning,
    setCanvasState,
    zoomIn,
    zoomOut,
    resetZoom,
    panX,
    panY,
  } = useInfiniteCanvas({ canvasRef });

  const handleClick = useCallback(() => {
    const hash = window.location.hash;
    if (hash) {
      const url = `${window.location.origin}/${hash}`;
      onOpen(CanvaModalType.Share, url);
      return;
    }
    onOpen(CanvaModalType.Session, null);
  }, [onOpen]);

  useEffect(() => {
    const hasShapes = localStorage.getItem("sketchidraw");
    if (hasShapes) {
      const shapes: Shape[] = JSON.parse(hasShapes);
      onSetCanvaShapes(shapes);
    }
  }, [onSetCanvaShapes]);

  useEffect(() => {
    saveToLocalStorage(canvaShapes);
  }, [canvaShapes]);

  const showWelcomeScreen =
    tooltype === ToolType.Select && canvaShapes.length === 0;
  return (
    <div className="min-h-screen overflow-hidden dark:bg-surface-lowest relative">
      {showWelcomeScreen && <WelcomeScreen />}
      <CanvaClearModal setSelectedShapeIndex={setSelectedShapeIndex} />
      <CanvaCollabModal />
      <CanvaShareModal />
      <CanvasProperty
        canvasRef={canvasRef}
        selectedShapeIndex={selectedShapeIndex}
      />
      <CanvasMenu />
      <ToolsMenu />
      <button
        onClick={handleClick}
        type="button"
        className="hidden sm:block absolute z-[100] right-6 top-6 h-10 text-xs bg-primary border-primary hover:bg-primary-darker hover:border-primary-darker shadow-md p-3 rounded-md cursor-pointer font-normal text-surface-lowest"
      >
        Share
      </button>
      <CanvaZoom zoomIn={zoomIn} zoomOut={zoomOut} resetZoom={resetZoom} />
      <CanvasBoard
        panX={panX}
        panY={panY}
        canvasRef={canvasRef}
        selectedShapeIndex={selectedShapeIndex}
        setSelectedShapeIndex={setSelectedShapeIndex}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
        handleWheel={handleWheel}
        setCanvasState={setCanvasState}
        expandCanvasForPanning={expandCanvasForPanning}
      />
    </div>
  );
};
