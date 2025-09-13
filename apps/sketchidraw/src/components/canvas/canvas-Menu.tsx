"use client";

import { Shape } from "@/types/shape";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { AppHamburger } from "./app-hamburger";
import { CanvasColorPalette } from "./canvas-color-palette";
import { CanvasMenuOptions } from "./canvas-menu-options";
import { RefObject } from "react";
import { ClientEvents } from "@/constants";
import { CanvasMobileZoom } from "./canvas-mobile-zoom";

type CanvasMenuProps = {
  selectedShapeId: string | null;
  isConnected: boolean;
  shapes: Shape[];
  canvasRef: RefObject<HTMLCanvasElement | null>;
  zoomIn: (factor: number) => void;
  zoomOut: (factor: number) => void;
  resetZoom: () => void;
  sendEncryptedMessage: (
    shape: Shape,
    type: ClientEvents,
    toBeAdded: boolean,
    toBeDeleted: boolean
  ) => void;
};

export const CanvasMenu = ({
  selectedShapeId,
  isConnected,
  shapes,
  canvasRef,
  zoomIn,
  zoomOut,
  resetZoom,
  sendEncryptedMessage,
}: CanvasMenuProps) => {
  return (
    <div className="absolute z-[100] left-6 bottom-6 right-6 top-auto sm:left-6 sm:top-6 sm:bottom-auto sm:right-auto flex items-center justify-between shadow-md border border-neutral-200 dark:border-none bg-white dark:bg-surface-low p-2 sm:p-0 rounded-md transition duration-200">
      <Popover>
        <PopoverTrigger asChild>
          <AppHamburger />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="z-[200] h-[calc(100vh-200px)] sm:h-[calc(100vh-100px)] w-[calc(100vw-48px)] sm:w-60 mb-2 -ml-2  px-4 py-6 sm:mt-2 sm:ml-0 bg-white dark:bg-surface-low max-h-[75vh] overflow-y-auto"
        >
          <CanvasMenuOptions isConnected={isConnected} />
        </PopoverContent>
      </Popover>
      <CanvasColorPalette
        isConnected={isConnected}
        shapes={shapes}
        canvasRef={canvasRef}
        selectedShapeId={selectedShapeId}
        sendEncryptedMessage={sendEncryptedMessage}
      />
      <CanvasMobileZoom
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        resetZoom={resetZoom}
      />
    </div>
  );
};
