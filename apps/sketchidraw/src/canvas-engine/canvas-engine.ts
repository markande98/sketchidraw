import { Shape } from "@/types/shape";
import { RoughCanvas } from "roughjs/bin/canvas";

export class CanvasEngine {
  private canvas: HTMLCanvasElement;
  private roughCanvas: RoughCanvas;
  private shapes: Shape[];
  private stColor: string | null;
  private bgColor: string | null;

  constructor(canvas: HTMLCanvasElement, roughCanvas: RoughCanvas) {
    this.shapes = [];
    this.stColor = "";
    this.bgColor = "";
    this.canvas = canvas;
    this.roughCanvas = roughCanvas;
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
              stroke: "#ef4444",
              strokeWidth: 2,
              fill: "rgba(239, 68, 68, 0.1)",
              fillStyle: "hachure",
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
            stroke: "#ef4444",
            strokeWidth: 2,
            fill: "rgba(239, 68, 68, 0.1)",
            fillStyle: "hachure",
          }
        );
        break;
      default:
        break;
    }
  }
}
