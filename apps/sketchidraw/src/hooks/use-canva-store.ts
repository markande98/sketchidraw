import { ToolType } from "@/types/tools";
import { RoughCanvas } from "roughjs/bin/canvas";
import { create } from "zustand";

interface CanvaStore {
  canvas: HTMLCanvasElement | null;
  roughCanvas: RoughCanvas | null;
  tooltype: ToolType;

  onSetCanva: (canvas: HTMLCanvasElement) => void;
  onSelectTooltype: (tooltype: ToolType) => void;
  onSetRoughCanvas: (roughCanvas: RoughCanvas) => void;
}

export const useCanva = create<CanvaStore>((set) => ({
  canvas: null,
  roughCanvas: null,
  tooltype: "Rectangle",

  onSetCanva: (canvas: HTMLCanvasElement) => set({ canvas }),
  onSetRoughCanvas: (roughCanvas: RoughCanvas) => set({ roughCanvas }),
  onSelectTooltype: (tooltype: ToolType) => set({ tooltype }),
}));
