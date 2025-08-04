import { Edges, FillStyle } from "@/constants/index";
import { Sloppiness } from "@/constants";

type ShapeOptions = {
  fill?: string;
  fillStyle?: FillStyle;
  sloppiness?: Sloppiness;
  stroke?: string;
  strokeWidth?: number;
  strokeDashOffset?: number;
};

type Rectangle = ShapeOptions & {
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  edgeType: Edges;
};

type Ellipse = ShapeOptions & {
  type: "ellipse";
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Shape = Rectangle | Ellipse;
