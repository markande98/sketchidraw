import { FillStyle } from "@/constants/color";
import { useCanva } from "@/hooks/use-canva-store";
import { Shape } from "@/types/shape";
import { RoughCanvas } from "roughjs/bin/canvas";

export class CanvasEngine {
  private canvas: HTMLCanvasElement;
  private roughCanvas: RoughCanvas;
  private shapes: Shape[];
  private stColor: string | null;
  private bgColor: string | null;
  private stWidth: number | null;
  private stDashOffset: number | null;
  private fillStyle: FillStyle;
  private unsubscribe: () => void;

  constructor(canvas: HTMLCanvasElement, roughCanvas: RoughCanvas) {
    this.shapes = [];
    this.canvas = canvas;
    this.stColor = "";
    this.bgColor = "";
    this.stWidth = 0;
    this.stDashOffset = 0;
    this.roughCanvas = roughCanvas;
    this.fillStyle = FillStyle.CrossHatch;
    this.unsubscribe = useCanva.subscribe((state) => {
      this.bgColor = state.canvaBgColor;
      this.stColor = state.canvaStrokeColor;
      this.stWidth = state.canvaStrokeWidth;
      this.stDashOffset = state.canvaStrokeDashOffset;
      this.fillStyle = state.canvaFillstyle;
    });
  }

  set backgroundColor(value: string) {
    this.bgColor = value;
  }

  get backgroundColor(): string | null {
    return this.bgColor ?? null;
  }

  set strokeColor(value: string) {
    this.stColor = value;
  }

  get strokeColor(): string | null {
    return this.stColor;
  }

  public addShape(shape: Shape): void {
    this.shapes = [...this.shapes, shape];
  }

  public redrawShapes(): void {
    const ctx = this.canvas.getContext("2d");

    ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.shapes.forEach((shape) => {
      switch (shape.type) {
        case "Rectangle":
          this.roughCanvas.rectangle(
            shape.x,
            shape.y,
            shape.width,
            shape.height,
            {
              stroke: shape.stroke,
              strokeWidth: shape.strokeWidth,
              fill: shape.fill,
              fillStyle: shape.fillStyle,
              roughness: 3,
              strokeLineDash: [shape.strokeDashOffset ?? 0],
              hachureAngle: 120,
              hachureGap: 20,
              fillWeight: 3,
            }
          );
          break;
        default:
          break;
      }
    });
  }

  public drawShape(shape: Shape): void {
    switch (shape.type) {
      case "Rectangle":
        this.roughCanvas.rectangle(
          shape.x,
          shape.y,
          shape.width,
          shape.height,
          {
            stroke: this.stColor ?? undefined,
            strokeWidth: this.stWidth ?? 0,
            fill: this.bgColor ?? "",
            fillStyle: this.fillStyle,
            roughness: 3,
            strokeLineDash: [this.stDashOffset ?? 0],
            hachureAngle: 120,
            hachureGap: 20,
            fillWeight: 3,
          }
        );
        break;
      default:
        break;
    }
  }

  public destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
