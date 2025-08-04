import { Edges, FillStyle, Sloppiness } from "@/constants/index";
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
  private sloppiness: Sloppiness;
  private edgeType: Edges;
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
    this.sloppiness = Sloppiness.Architect;
    this.edgeType = Edges.Sharp;
    this.unsubscribe = useCanva.subscribe((state) => {
      this.bgColor = state.canvaBgColor;
      this.stColor = state.canvaStrokeColor;
      this.stWidth = state.canvaStrokeWidth;
      this.stDashOffset = state.canvaStrokeDashOffset;
      this.fillStyle = state.canvaFillstyle;
      this.sloppiness = state.canvaSloppiness;
      this.edgeType = state.canvaEdge;
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
        case "rectangle":
          const path = this.roundedRectPath(
            shape.x,
            shape.y,
            shape.width,
            shape.height,
            shape.edgeType
          );

          this.roughCanvas.path(path, {
            stroke: shape.stroke,
            strokeWidth: shape.strokeWidth,
            roughness: shape.sloppiness,
            fill: shape.fill,
            fillStyle: shape.fillStyle,
            strokeLineDash: [shape.strokeDashOffset ?? 0],
            hachureAngle: 120,
            hachureGap: 20,
            fillWeight: 2,
            seed: 234562432,
          });
          break;
        default:
          break;
      }
    });
  }
  private roundedRectPath(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: Edges
  ): string {
    return `M ${x + radius} ${y}
          L ${x + width - radius} ${y}
          Q ${x + width} ${y} ${x + width} ${y + radius}
          L ${x + width} ${y + height - radius}
          Q ${x + width} ${y + height} ${x + width - radius} ${y + height}
          L ${x + radius} ${y + height}
          Q ${x} ${y + height} ${x} ${y + height - radius}
          L ${x} ${y + radius}
          Q ${x} ${y} ${x + radius} ${y} Z`;
  }

  public drawShape(shape: Shape): void {
    switch (shape.type) {
      case "rectangle":
        const path = this.roundedRectPath(
          shape.x,
          shape.y,
          shape.width,
          shape.height,
          shape.edgeType
        );
        this.roughCanvas.path(path, {
          stroke: this.stColor ?? undefined,
          strokeWidth: this.stWidth ?? 0,
          roughness: this.sloppiness,
          fill: this.bgColor ?? "",
          fillStyle: this.fillStyle,
          strokeLineDash: [this.stDashOffset ?? 0],
          hachureAngle: 120,
          hachureGap: 20,
          fillWeight: 2,
          seed: 234562432,
        });
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
