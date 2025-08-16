import { ToolsMenu } from "./tools-menu";
import { CanvasBoard } from "./canvas-board";
import { CanvasProperty } from "../canvas-property";
import { CanvasMenu } from "./canvas-Menu";

export const CanvasView = () => {
  return (
    <div className="min-h-screen overflow-hidden dark:bg-surface-lowest relative">
      <CanvasProperty />
      <div className="absolute z-[100] top-0 left-0 right-0 px-6 py-4 flex justify-between">
        <CanvasMenu />
        <ToolsMenu />
        <button
          type="button"
          className="text-xs bg-[#a8a5ff]/95 hover:bg-[#a8a5ff] shadow-md p-3 rounded-md cursor-pointer font-normal text-black"
        >
          Share
        </button>
      </div>
      <CanvasBoard />
    </div>
  );
};
