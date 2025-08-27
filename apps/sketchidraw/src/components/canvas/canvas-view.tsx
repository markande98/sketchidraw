"use client";

import { CanvaModalType } from "@/constants";
import { useCanva } from "@/hooks/use-canva-store";
import { useInfiniteCanvas } from "@/hooks/use-infinite-canvas";
import { saveToLocalStorage } from "@/lib/utils";
import { Shape } from "@/types/shape";
import { ToolType } from "@/types/tools";
import { useCallback, useEffect, useRef, useState } from "react";
import { CanvaZoom } from "../canva-zoom";
import { CanvasProperty } from "../canvas-property";
import { WelcomeScreen } from "../welcome-screen";
import { CanvaClearModal } from "./canva-clear-modal";
import { CanvaCollabModal } from "./canva-collab-modal";
import { CanvaShareModal } from "./canva-share-modal";
import { CanvasBoard } from "./canvas-board";
import { CanvasMenu } from "./canvas-Menu";
import { ToolsMenu } from "./tools-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { redirect } from "next/navigation";

export const CanvasView = () => {
  const { user, status } = useCurrentUser();
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
    if (!user || status === "unauthenticated") {
      redirect("/auth/signin");
      return;
    }
    const hash = window.location.hash;
    if (hash) {
      const url = `${window.location.origin}/${hash}`;
      onOpen(CanvaModalType.Share, url);
      return;
    }
    onOpen(CanvaModalType.Session, null);
  }, [onOpen, status, user]);

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
