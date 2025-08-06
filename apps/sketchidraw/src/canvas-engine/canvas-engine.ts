import { getStroke } from "perfect-freehand";
import { ArrowTypes, Edges, FillStyle, Sloppiness } from "@/constants/index";
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
          point.x >= shape.x &&
          point.x <= shape.x + shape.width &&
          point.y >= shape.y &&
          point.y <= shape.y + shape.height;
        break;
      default:
        break;
    }
    return isInside;
  }

  public resizeRectShape(
    x: number,
    y: number,
    width: number,
    height: number,
    dx: number,
    dy: number,
    resizeHandle: string | null
  ): { x: number; y: number; width: number; height: number } {
    switch (resizeHandle) {
      case "nw":
        x += dx;
        y += dy;
        width -= dx;
        height -= dy;
        break;
      case "ne":
        y += dy;
        width += dx;
        height -= dy;
        break;
      case "sw":
        x += dx;
        width -= dx;
        height += dy;
        break;
      case "se":
        width += dx;
        height += dy;
        break;
      case "n":
        y += dy;
        height -= dy;
        break;
      case "s":
        height += dy;
        break;
      case "w":
        x += dx;
        width -= dx;
        break;
      case "e":
        width += dx;
        break;
    }
    return {
      x,
      y,
      width,
      height,
    };
  }

  public getResizeHandle(point: { x: number; y: number }, shape: Shape) {
    const handleSize = 8;
    let handles: { x: number; y: number; type: string }[] = [];
    switch (shape.type) {
      case ToolType.Rectangle:
        handles = [
          {
            x: shape.x - handleSize / 2,
            y: shape.y - handleSize / 2,
            type: "nw",
          },
          {
            x: shape.x + shape.width - handleSize / 2,
            y: shape.y - handleSize / 2,
            type: "ne",
          },
          {
            x: shape.x - handleSize / 2,
            y: shape.y + shape.height - handleSize / 2,
            type: "sw",
          },
          {
            x: shape.x + shape.width - handleSize / 2,
            y: shape.y + shape.height - handleSize / 2,
            type: "se",
          },
          {
            x: shape.x + shape.width / 2 - handleSize / 2,
            y: shape.y - handleSize / 2,
            type: "n",
          },
          {
            x: shape.x + shape.width / 2 - handleSize / 2,
            y: shape.y + shape.height - handleSize / 2,
            type: "s",
          },
          {
            x: shape.x - handleSize / 2,
            y: shape.y + shape.height / 2 - handleSize / 2,
            type: "w",
          },
          {
            x: shape.x + shape.width - handleSize / 2,
            y: shape.y + shape.height / 2 - handleSize / 2,
            type: "e",
          },
        ];
        break;
      default:
        break;
    }

    for (const handle of handles) {
      if (
        point.x >= handle.x &&
        point.x <= handle.x + handleSize &&
        point.y >= handle.y &&
        point.y <= handle.y + handleSize
      ) {
        return handle.type;
      }
    }
    return null;
  }

  public drawResizeHandles(shape: Shape) {
    const handleSize = 8;
    const ctx = this.canvas.getContext("2d");
    switch (shape.type) {
      case ToolType.Rectangle:
        const handles = [
          {
            x: shape.x - handleSize / 2,
            y: shape.y - handleSize / 2,
            cursor: "nw-resize",
            type: "nw",
          },
          {
            x: shape.x + shape.width - handleSize / 2,
            y: shape.y - handleSize / 2,
            cursor: "ne-resize",
            type: "ne",
          },
          {
            x: shape.x - handleSize / 2,
            y: shape.y + shape.height - handleSize / 2,
            cursor: "sw-resize",
            type: "sw",
          },
          {
            x: shape.x + shape.width - handleSize / 2,
            y: shape.y + shape.height - handleSize / 2,
            cursor: "se-resize",
            type: "se",
          },
          {
            x: shape.x + shape.width / 2 - handleSize / 2,
            y: shape.y - handleSize / 2,
            cursor: "n-resize",
            type: "n",
          },
          {
            x: shape.x + shape.width / 2 - handleSize / 2,
            y: shape.y + shape.height - handleSize / 2,
            cursor: "s-resize",
            type: "s",
          },
          {
            x: shape.x - handleSize / 2,
            y: shape.y + shape.height / 2 - handleSize / 2,
            cursor: "w-resize",
            type: "w",
          },
          {
            x: shape.x + shape.width - handleSize / 2,
            y: shape.y + shape.height / 2 - handleSize / 2,
            cursor: "e-resize",
            type: "e",
          },
        ];
        if (ctx) {
          ctx.fillStyle = "#4f46e5";
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
        }
        handles.forEach((handle) => {
          ctx?.fillRect(handle.x, handle.y, handleSize, handleSize);
          ctx?.strokeRect(handle.x, handle.y, handleSize, handleSize);
        });
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
            shape.x,
            shape.y,
            shape.width,
            shape.height,
            shape.edgeType
          );
          this.roughCanvas.path(path, options);
          break;
        case ToolType.Ellipse:
          this.roughCanvas.ellipse(
            shape.centerX,
            shape.centerY,
            shape.width,
            shape.height,
            options
          );
          break;
        case ToolType.Diamond:
          const points = this.getDiamondPoints(
            shape.centerX,
            shape.centerY,
            shape.width,
            shape.height
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
          shape.x,
          shape.y,
          shape.width,
          shape.height,
          shape.edgeType
        );
        this.roughCanvas.path(path, options);
        break;
      case ToolType.Ellipse:
        this.roughCanvas.ellipse(
          shape.centerX,
          shape.centerY,
          shape.width,
          shape.height,
          options
        );
        break;
      case ToolType.Diamond:
        const points = this.getDiamondPoints(
          shape.centerX,
          shape.centerY,
          shape.width,
          shape.height
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
