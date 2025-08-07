import { getStroke } from "perfect-freehand";
import {
  ArrowTypes,
  Edges,
  FillStyle,
  HANDLE_SIZE,
  Sloppiness,
} from "@/constants/index";
import { useCanva } from "@/hooks/use-canva-store";
import { Shape, ShapeOptions } from "@/types/shape";
import { ToolType } from "@/types/tools";
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
  private arrowType: ArrowTypes;
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
    this.arrowType = ArrowTypes.Arrow;
    this.unsubscribe = useCanva.subscribe((state) => {
      this.shapes = state.canvaShapes;
      this.bgColor = state.canvaBgColor;
      this.stColor = state.canvaStrokeColor;
      this.stWidth = state.canvaStrokeWidth;
      this.stDashOffset = state.canvaStrokeDashOffset;
      this.fillStyle = state.canvaFillstyle;
      this.sloppiness = state.canvaSloppiness;
      this.edgeType = state.canvaEdge;
      this.arrowType = state.canvaArrowType;
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

  private getCanvaOptions() {
    const options = {
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
    };
    return options;
  }

  public isPointInshape(point: { x: number; y: number }, shape: Shape) {
    let isInside = false;
    switch (shape.type) {
      case ToolType.Rectangle:
        isInside =
          point.x >= Math.min(shape.startX, shape.endX) &&
          point.x <= Math.max(shape.startX, shape.endX) &&
          point.y >= Math.min(shape.startY, shape.endY) &&
          point.y <= Math.max(shape.startY, shape.endY);
        break;
      case ToolType.Ellipse:
        const centerX = (shape.startX + shape.endX) / 2;
        const centerY = (shape.startY + shape.endY) / 2;
        isInside =
          Math.pow(point.x - centerX, 2) /
            Math.pow((shape.endX - shape.startX) / 2, 2) +
            Math.pow(point.y - centerY, 2) /
              Math.pow((shape.endY - shape.startY) / 2, 2) <=
          1;
        break;
      default:
        break;
    }
    return isInside;
  }

  public resizeRectShape(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    dx: number,
    dy: number,
    resizeHandle: string | null
  ): { startX: number; startY: number; endX: number; endY: number } {
    switch (resizeHandle) {
      case "nw":
        startX += dx;
        startY += dy;
        break;
      case "ne":
        startY += dy;
        endX += dx;
        break;
      case "se":
        endX += dx;
        endY += dy;
        break;
      case "sw":
        endY += dy;
        startX += dx;
        break;
    }
    return {
      startX,
      startY,
      endX,
      endY,
    };
  }

  public getResizeHandle(point: { x: number; y: number }, shape: Shape) {
    let handles: { x: number; y: number; type: string }[] = [];
    switch (shape.type) {
      case ToolType.Rectangle:
      case ToolType.Ellipse:
        handles = [
          {
            x: shape.startX - HANDLE_SIZE,
            y: shape.startY - HANDLE_SIZE,
            type: "nw",
          },
          {
            x: shape.endX,
            y: shape.startY - HANDLE_SIZE,
            type: "ne",
          },
          {
            x: shape.endX,
            y: shape.endY,
            type: "se",
          },
          {
            x: shape.startX - HANDLE_SIZE,
            y: shape.endY,
            type: "sw",
          },
        ];
        break;
      default:
        break;
    }

    for (const handle of handles) {
      if (
        point.x >= handle.x &&
        point.x <= handle.x + HANDLE_SIZE &&
        point.y >= handle.y &&
        point.y <= handle.y + HANDLE_SIZE
      ) {
        return handle.type;
      }
    }
    return null;
  }

  public drawResizeHandles(shape: Shape) {
    switch (shape.type) {
      case ToolType.Rectangle:
      case ToolType.Ellipse:
        const handles = [
          {
            x: Math.min(shape.startX, shape.endX),
            y: Math.min(shape.startY, shape.endY),
            cursor: "nw-resize",
            type: "nw",
          },
          {
            x: Math.max(shape.startX, shape.endX),
            y: Math.min(shape.startY, shape.endY),
            cursor: "ne-resize",
            type: "ne",
          },
          {
            x: Math.max(shape.startX, shape.endX),
            y: Math.max(shape.startY, shape.endY),
            cursor: "se-resize",
            type: "se",
          },
          {
            x: Math.min(shape.startX, shape.endX),
            y: Math.max(shape.startY, shape.endY),
            cursor: "sw-resize",
            type: "sw",
          },
        ];
        const options = {
          fillStyle: "transparent",
          stroke: "#a8a5ff",
          strokeWidth: 2,
          roughness: 0,
        };
        handles.forEach((handle) => {
          switch (handle.type) {
            case "nw":
              this.roughCanvas.rectangle(
                handle.x - HANDLE_SIZE,
                handle.y - HANDLE_SIZE,
                HANDLE_SIZE,
                HANDLE_SIZE,
                {
                  ...options,
                }
              );
              break;
            case "ne":
              this.roughCanvas.rectangle(
                handle.x,
                handle.y - HANDLE_SIZE,
                HANDLE_SIZE,
                HANDLE_SIZE,
                {
                  ...options,
                }
              );
              break;
            case "se":
              this.roughCanvas.rectangle(
                handle.x,
                handle.y,
                HANDLE_SIZE,
                HANDLE_SIZE,
                { ...options }
              );
              break;
            case "sw":
              this.roughCanvas.rectangle(
                handle.x - HANDLE_SIZE,
                handle.y,
                HANDLE_SIZE,
                HANDLE_SIZE,
                { ...options }
              );
              break;
            default:
              break;
          }
        });
        this.roughCanvas.line(
          handles[0].x,
          handles[0].y - HANDLE_SIZE / 2,
          handles[1].x,
          handles[1].y - HANDLE_SIZE / 2,
          {
            ...options,
          }
        );
        this.roughCanvas.line(
          handles[1].x + HANDLE_SIZE / 2,
          handles[1].y,
          handles[2].x + HANDLE_SIZE / 2,
          handles[2].y,
          {
            ...options,
          }
        );
        this.roughCanvas.line(
          handles[2].x,
          handles[2].y + HANDLE_SIZE / 2,
          handles[3].x,
          handles[3].y + HANDLE_SIZE / 2,
          {
            ...options,
          }
        );
        this.roughCanvas.line(
          handles[3].x - HANDLE_SIZE / 2,
          handles[3].y,
          handles[0].x - HANDLE_SIZE / 2,
          handles[0].y,
          {
            ...options,
          }
        );
        break;
      default:
        break;
    }
  }

  public redrawShapes(selectedShapeIndex: number | null): void {
    const ctx = this.canvas.getContext("2d");

    ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.shapes.forEach((shape, index) => {
      const isSelected = selectedShapeIndex === index;
      const options = {
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
      };
      switch (shape.type) {
        case ToolType.Rectangle:
          const path = this.roundedRectPath(
            shape.startX,
            shape.startY,
            shape.endX - shape.startX,
            shape.endY - shape.startY,
            shape.edgeType
          );
          this.roughCanvas.path(path, options);
          break;
        case ToolType.Ellipse:
          this.roughCanvas.ellipse(
            (shape.startX + shape.endX) / 2,
            (shape.startY + shape.endY) / 2,
            shape.endX - shape.startX,
            shape.endY - shape.startY,
            options
          );
          break;
        case ToolType.Diamond:
          const points = this.getDiamondPoints(
            (shape.startX + shape.endX) / 2,
            (shape.startY + shape.endY) / 2,
            (shape.endX - shape.startX) / 2,
            (shape.endY - shape.startY) / 2
          );
          this.roughCanvas.polygon(points, options);
          break;
        case ToolType.Line:
          this.roughCanvas.line(
            shape.startX,
            shape.startY,
            shape.endX,
            shape.endY,
            options
          );
          break;
        case ToolType.Arrow:
          this.drawLineWithArrow(
            shape.startX,
            shape.startY,
            shape.endX,
            shape.endY,
            shape.arrowType,
            options,
            shape.stroke
          );
          break;
        case ToolType.Pencil:
          this.drawWithPencil(shape.points, options);
          break;
        default:
          break;
      }

      if (isSelected) {
        this.drawResizeHandles(shape);
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

  private getDiamondPoints(
    centerX: number,
    centerY: number,
    width: number,
    height: number
  ): [number, number][] {
    const points: [number, number][] = [
      [centerX, centerY - height],
      [centerX + width, centerY],
      [centerX, centerY + height],
      [centerX - width, centerY],
    ];
    return points;
  }

  private drawLineWithArrow(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    arrowType: ArrowTypes,
    options: ShapeOptions,
    fill?: string
  ) {
    this.roughCanvas.line(startX, startY, endX, endY, options);

    const arrowSize = 20;
    const angle = Math.atan2(endY - startY, endX - startX);
    const arrowAngle = Math.PI / 6;

    const arrowX1 = endX - arrowSize * Math.cos(angle - arrowAngle);
    const arrowY1 = endY - arrowSize * Math.sin(angle - arrowAngle);
    const arrowX2 = endX - arrowSize * Math.cos(angle + arrowAngle);
    const arrowY2 = endY - arrowSize * Math.sin(angle + arrowAngle);

    const arrowPoint1: [number, number] = [
      endX - arrowSize * Math.cos(angle - Math.PI / 6),
      endY - arrowSize * Math.sin(angle - Math.PI / 6),
    ];

    const arrowPoint2: [number, number] = [
      endX - arrowSize * Math.cos(angle + Math.PI / 6),
      endY - arrowSize * Math.sin(angle + Math.PI / 6),
    ];

    switch (arrowType) {
      case ArrowTypes.Arrow:
        this.roughCanvas.line(endX, endY, arrowX1, arrowY1, options);
        this.roughCanvas.line(endX, endY, arrowX2, arrowY2, options);
        break;
      case ArrowTypes.TriangleOutline:
        this.roughCanvas.polygon(
          [[endX, endY], arrowPoint1, arrowPoint2],
          options
        );
        break;
      case ArrowTypes.Triangle:
        this.roughCanvas.polygon([[endX, endY], arrowPoint1, arrowPoint2], {
          ...options,
          fill,
          fillStyle: "solid",
        });
        break;
      default:
        break;
    }
  }

  private drawWithPencil(
    points: [x: number, y: number][],
    options: ShapeOptions
  ) {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;
    if (points.length < 2) return;

    const stroke = getStroke(points, {
      size: options.strokeWidth ? options.strokeWidth * 5 : 4,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
    });

    console.log(stroke);
    if (stroke.length === 0) return;

    ctx.fillStyle = options.stroke;
    ctx.beginPath();

    ctx.moveTo(stroke[0][0], stroke[0][1]);

    for (let i = 1; i < stroke.length; i++) {
      ctx.lineTo(stroke[i][0], stroke[i][1]);
    }

    ctx.closePath();
    ctx.fill();
  }

  public drawShape(shape: Shape): void {
    const options = this.getCanvaOptions();
    switch (shape.type) {
      case ToolType.Rectangle:
        const path = this.roundedRectPath(
          shape.startX,
          shape.startY,
          shape.endX - shape.startX,
          shape.endY - shape.startY,
          shape.edgeType
        );
        this.roughCanvas.path(path, options);
        break;
      case ToolType.Ellipse:
        this.roughCanvas.ellipse(
          (shape.startX + shape.endX) / 2,
          (shape.startY + shape.endY) / 2,
          shape.endX - shape.startX,
          shape.endY - shape.startY,
          options
        );
        break;
      case ToolType.Diamond:
        const points = this.getDiamondPoints(
          (shape.startX + shape.endX) / 2,
          (shape.startY + shape.endY) / 2,
          (shape.endX - shape.startX) / 2,
          (shape.endY - shape.startY) / 2
        );
        this.roughCanvas.polygon(points, options);
        break;
      case ToolType.Line:
        this.roughCanvas.line(
          shape.startX,
          shape.startY,
          shape.endX,
          shape.endY,
          options
        );
        break;
      case ToolType.Arrow:
        this.drawLineWithArrow(
          shape.startX,
          shape.startY,
          shape.endX,
          shape.endY,
          shape.arrowType,
          options,
          shape.stroke
        );
        break;
      case ToolType.Pencil:
        this.drawWithPencil(shape.points, options);
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
