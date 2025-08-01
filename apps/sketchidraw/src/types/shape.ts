import { FillStyle } from "@/constants/color";
import { ToolType } from "./tools";

type Rectangle = {
  type: ToolType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  fillStyle: FillStyle;
  stroke: string;
  strokeWidth: number;
  strokeDashOffset: number;
};

export type Shape = Rectangle;
