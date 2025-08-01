import { create } from "zustand";

import { ToolType } from "@/types/tools";
import { RoughCanvas } from "roughjs/bin/canvas";
import {
  BACKGROUND_COLOR,
  Edges,
  FillStyle,
  Sloppiness,
  STROKE_COLORS,
  STROKE_DASH_OFFSET,
  STROKE_WIDTH,
} from "@/constants/index";

interface CanvaStore {
  canvas: HTMLCanvasElement | null;
  roughCanvas: RoughCanvas | null;
  tooltype: ToolType;
  canvaBgColor: string | "transparent";
  canvaStrokeColor: string;
  canvaStrokeWidth: number;
  canvaStrokeDashOffset: number;
  canvaFillstyle: FillStyle;
  canvaSloppiness: Sloppiness;
  canvaEdge: Edges;

  onSetCanva: (canvas: HTMLCanvasElement) => void;
  onSelectTooltype: (tooltype: ToolType) => void;
  onSetRoughCanvas: (roughCanvas: RoughCanvas) => void;
  onSetCanvaBgColor: (color: string) => void;
  onSetCanvaStrokeColor: (color: string) => void;
  onSetCanvaStrokeWidth: (width: number) => void;
  onSetCanvaStrokeDashOffset: (offset: number) => void;
  onSetCanvaFillstyle: (style: FillStyle) => void;
  onSetCanvaSloppiness: (sloppiness: Sloppiness) => void;
  onSetCanvaEdge: (edge: Edges) => void;
}

export const useCanva = create<CanvaStore>((set) => ({
  canvas: null,
  roughCanvas: null,
  tooltype: "Rectangle",
  canvaBgColor: BACKGROUND_COLOR[0],
  canvaStrokeColor: STROKE_COLORS[0],
  canvaStrokeWidth: STROKE_WIDTH[0],
  canvaStrokeDashOffset: STROKE_DASH_OFFSET[0],
  canvaFillstyle: FillStyle.Hachure,
  canvaSloppiness: Sloppiness.Architect,
  canvaEdge: Edges.Sharp,

  onSetCanva: (canvas: HTMLCanvasElement) => set({ canvas }),
  onSetRoughCanvas: (roughCanvas: RoughCanvas) => set({ roughCanvas }),
  onSelectTooltype: (tooltype: ToolType) => set({ tooltype }),
  onSetCanvaBgColor: (color: string) => set({ canvaBgColor: color }),
  onSetCanvaStrokeColor: (color: string) => set({ canvaStrokeColor: color }),
  onSetCanvaStrokeWidth: (width: number) => set({ canvaStrokeWidth: width }),
  onSetCanvaStrokeDashOffset: (offset: number) =>
    set({ canvaStrokeDashOffset: offset }),
  onSetCanvaFillstyle: (style: FillStyle) => set({ canvaFillstyle: style }),
  onSetCanvaSloppiness: (sloppiness: Sloppiness) =>
    set({ canvaSloppiness: sloppiness }),
  onSetCanvaEdge: (edge: Edges) => set({ canvaEdge: edge }),
}));
