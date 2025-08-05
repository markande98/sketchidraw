import { create } from "zustand";

import { ToolType } from "@/types/tools";
import { RoughCanvas } from "roughjs/bin/canvas";
import {
  ArrowTypes,
  BACKGROUND_COLOR,
  CANVAS_BG_COLOR,
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
  themeColor: string;
  tooltype: ToolType;
  canvaBgColor: string | "transparent";
  canvaStrokeColor: string;
  canvaStrokeWidth: number;
  canvaStrokeDashOffset: number;
  canvaFillstyle: FillStyle;
  canvaSloppiness: Sloppiness;
  canvaEdge: Edges;
  canvaArrowType: ArrowTypes;

  onSetCanva: (canvas: HTMLCanvasElement) => void;
  onSetThemeColor: (color: string) => void;
  onSelectTooltype: (tooltype: ToolType) => void;
  onSetRoughCanvas: (roughCanvas: RoughCanvas) => void;
  onSetCanvaBgColor: (color: string) => void;
  onSetCanvaStrokeColor: (color: string) => void;
  onSetCanvaStrokeWidth: (width: number) => void;
  onSetCanvaStrokeDashOffset: (offset: number) => void;
  onSetCanvaFillstyle: (style: FillStyle) => void;
  onSetCanvaSloppiness: (sloppiness: Sloppiness) => void;
  onSetCanvaEdge: (edge: Edges) => void;
  onsetCanvaArrowType: (type: ArrowTypes) => void;
}

export const useCanva = create<CanvaStore>((set) => ({
  canvas: null,
  themeColor: CANVAS_BG_COLOR[0],
  roughCanvas: null,
  tooltype: ToolType.Rectangle,
  canvaBgColor: BACKGROUND_COLOR[0],
  canvaStrokeColor: STROKE_COLORS[0],
  canvaStrokeWidth: STROKE_WIDTH[0],
  canvaStrokeDashOffset: STROKE_DASH_OFFSET[0],
  canvaFillstyle: FillStyle.Hachure,
  canvaSloppiness: Sloppiness.Architect,
  canvaEdge: Edges.Sharp,
  canvaArrowType: ArrowTypes.Arrow,

  onSetCanva: (canvas: HTMLCanvasElement) => set({ canvas }),
  onSetThemeColor: (color: string) => set({ themeColor: color }),
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
  onsetCanvaArrowType: (type: ArrowTypes) => set({ canvaArrowType: type }),
}));
