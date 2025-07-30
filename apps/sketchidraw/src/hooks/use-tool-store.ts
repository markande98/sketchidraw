import { ToolType } from "@/types/tools";
import { create } from "zustand";

interface ToolStore {
  type: ToolType;
  onSelect: (value: ToolType) => void;
}

export const useTool = create<ToolStore>((set) => ({
  type: "Rectangle",
  onSelect: (value: ToolType) => set({ type: value }),
}));
