"use client";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { AppHamburger } from "./app-hamburger";
import { CanvasMenuOptions } from "./canvas-menu-options";

export const CanvasMenu = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <AppHamburger />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="z-[200] h-[calc(100vh-100px)] w-60 px-4 py-6 mt-2 bg-white dark:bg-surface-low max-h-[75vh] overflow-y-auto"
      >
        <CanvasMenuOptions />
      </PopoverContent>
    </Popover>
  );
};
