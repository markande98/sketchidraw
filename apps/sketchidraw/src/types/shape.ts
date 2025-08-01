import { Edges, FillStyle } from "@/constants/index";
import { ToolType } from "./tools";
import { Sloppiness } from "@/constants";

type Rectangle = {
  type: ToolType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  fillStyle: FillStyle;
  sloppiness: Sloppiness;
  edgeType: Edges;
  stroke: string;
  strokeWidth: number;
  strokeDashOffset: number;
};

export type Shape = Rectangle;
