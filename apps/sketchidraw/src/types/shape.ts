import { ToolType } from "./tools";

type Rectangle = {
  type: ToolType;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Shape = Rectangle;
