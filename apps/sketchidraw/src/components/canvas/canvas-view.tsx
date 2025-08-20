"use client";

import { ToolsMenu } from "./tools-menu";
import { CanvasBoard } from "./canvas-board";
import { CanvasProperty } from "../canvas-property";
import { CanvasMenu } from "./canvas-Menu";
import { CanvaZoom } from "../canva-zoom";
import { useInfiniteCanvas } from "@/hooks/use-infinite-canvas";
import { useRef } from "react";

export const CanvasView = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    zoomIn,
    zoomOut,
    resetZoom,
    panX,
    panY,
  } = useInfiniteCanvas({ canvasRef });
  return (
    <div className="min-h-screen overflow-hidden dark:bg-surface-lowest relative">
      <CanvasProperty />
      <div className="absolute z-[100] top-0 left-0 right-0 px-6 py-4 flex justify-between cursor-none">
        <CanvasMenu />
        <ToolsMenu />
        <button
          type="button"
          className="text-xs bg-[#a8a5ff]/95 hover:bg-[#a8a5ff] shadow-md p-3 rounded-md cursor-pointer font-normal text-black"
        >
          Share
        </button>
      </div>
      <CanvaZoom zoomIn={zoomIn} zoomOut={zoomOut} resetZoom={resetZoom} />
      <CanvasBoard
        panX={panX}
        panY={panY}
        canvasRef={canvasRef}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
        handleWheel={handleWheel}
      />
    </div>
  );
};
