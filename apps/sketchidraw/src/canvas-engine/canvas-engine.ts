import { getStroke } from "perfect-freehand";
import {
  ArrowTypes,
  Edges,
  FillStyle,
  HANDLE_SIZE,
  Sloppiness,
} from "@/constants/index";
import { useCanva } from "@/hooks/use-canva-store";
import { Shape, ShapeOptions, Text } from "@/types/shape";
import { ToolType } from "@/types/tools";
import { RoughCanvas } from "roughjs/bin/canvas";
import { hexToRgba } from "@/lib/utils";

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
    this.unsubscribe = useCanva.subscribe((state) => {
      this.shapes = state.canvaShapes;
      this.bgColor = state.canvaBgColor;
      this.stColor = state.canvaStrokeColor;
      this.stWidth = state.canvaStrokeWidth;
      this.stDashOffset = state.canvaStrokeDashOffset;
      this.fillStyle = state.canvaFillstyle;
      this.sloppiness = state.canvaSloppiness;
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
      isDeleted: true,
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

  private isPointInsidePolygon(x: number, y: number, polygon: number[][]) {
    function crossProduct(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      px: number,
      py: number
    ) {
      return (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1);
    }
    // Check if point is on the same side of all edges
    const signs = [];
    for (let i = 0; i < 4; i++) {
      const [x1, y1] = polygon[i];
      const [x2, y2] = polygon[(i + 1) % 4];
      const cross = crossProduct(x1, y1, x2, y2, x, y);
      signs.push(cross >= 0);
    }
    // All cross products should have the same sign for convex polygon
    return (
      signs.every((sign) => sign === true) ||
      signs.every((sign) => sign === false)
    );
  }

  public isPointInshape(point: { x: number; y: number }, shape: Shape) {
    let isInside = false;
    switch (shape.type) {
      case ToolType.Rectangle:
      case ToolType.Line:
      case ToolType.Arrow:
      case ToolType.Pencil:
      case ToolType.Text:
        isInside =
          point.x >= shape.startX &&
          point.x <= shape.endX &&
          point.y >= shape.startY &&
          point.y <= shape.endY;
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
      case ToolType.Diamond:
        const p1 = [(shape.startX + shape.endX) / 2, shape.endY];
        const p2 = [shape.endX, (shape.startY + shape.endY) / 2];
        const p3 = [(shape.startX + shape.endX) / 2, shape.startY];
        const p4 = [shape.startX, (shape.startY + shape.endY) / 2];
        return this.isPointInsidePolygon(point.x, point.y, [p1, p2, p3, p4]);
      default:
        break;
    }
    return isInside;
  }

  public resizeShape(
    type: ToolType,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    dx: number,
    dy: number,
    resizeHandle: string | null,
    sX: number,
    sY: number,
    mX: number,
    mY: number,
    eX: number,
    eY: number
  ): {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    sX: number;
    sY: number;
    mX: number;
    mY: number;
    eX: number;
    eY: number;
  } {
    if (type === ToolType.Line || type === ToolType.Arrow) {
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
        case "start":
          sX += dx;
          sY += dy;
          break;
        case "mid":
          mX += dx;
          mY += dy;
          break;
        case "end":
          eX += dx;
          eY += dy;
          break;
        default:
          break;
      }
    } else
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
      sX,
      sY,
      mX,
      mY,
      eX,
      eY,
    };
  }

  public getResizeHandle(point: { x: number; y: number }, shape: Shape) {
    let handles: { x: number; y: number; type: string }[] = [];
    switch (shape.type) {
      case ToolType.Rectangle:
      case ToolType.Ellipse:
      case ToolType.Diamond:
      case ToolType.Pencil:
      case ToolType.Text:
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
      case ToolType.Line:
      case ToolType.Arrow:
        handles = [
          {
            x: shape.sX,
            y: shape.sY,
            type: "start",
          },
          {
            x: shape.mX,
            y: shape.mY,
            type: "mid",
          },
          {
            x: shape.eX,
            y: shape.eY,
            type: "end",
          },
        ];
        break;
      default:
        break;
    }
    if (shape.type === ToolType.Line || shape.type === ToolType.Arrow) {
      for (const handle of handles) {
        const isInside =
          Math.pow(point.x - handle.x, 2) / Math.pow(HANDLE_SIZE / 2, 2) +
            Math.pow(point.y - handle.y, 2) / Math.pow(HANDLE_SIZE / 2, 2) <=
          1;
        if (isInside) return handle.type;
      }
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

  public drawResizeHandles(shape: Shape, panX: number, panY: number) {
    let handles;
    const options = {
      fillStyle: "transparent",
      stroke: "#a8a5ff",
      strokeWidth: 2,
      roughness: 0,
    };
    switch (shape.type) {
      case ToolType.Rectangle:
      case ToolType.Ellipse:
      case ToolType.Diamond:
      case ToolType.Pencil:
      case ToolType.Text:
        handles = [
          {
            x: Math.min(shape.startX, shape.endX) + panX,
            y: Math.min(shape.startY, shape.endY) + panY,
            cursor: "nw-resize",
            type: "nw",
          },
          {
            x: Math.max(shape.startX, shape.endX) + panX,
            y: Math.min(shape.startY, shape.endY) + panY,
            cursor: "ne-resize",
            type: "ne",
          },
          {
            x: Math.max(shape.startX, shape.endX) + panX,
            y: Math.max(shape.startY, shape.endY) + panY,
            cursor: "se-resize",
            type: "se",
          },
          {
            x: Math.min(shape.startX, shape.endX) + panX,
            y: Math.max(shape.startY, shape.endY) + panY,
            cursor: "sw-resize",
            type: "sw",
          },
        ];
        handles.forEach((handle) => {
          switch (handle.type) {
            case "nw":
              this.roughCanvas.rectangle(
                handle.x - HANDLE_SIZE,
                handle.y - HANDLE_SIZE,
                HANDLE_SIZE,
                HANDLE_SIZE,
                options
              );
              break;
            case "ne":
              this.roughCanvas.rectangle(
                handle.x,
                handle.y - HANDLE_SIZE,
                HANDLE_SIZE,
                HANDLE_SIZE,
                options
              );
              break;
            case "se":
              this.roughCanvas.rectangle(
                handle.x,
                handle.y,
                HANDLE_SIZE,
                HANDLE_SIZE,
                options
              );
              break;
            case "sw":
              this.roughCanvas.rectangle(
                handle.x - HANDLE_SIZE,
                handle.y,
                HANDLE_SIZE,
                HANDLE_SIZE,
                options
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
          options
        );
        this.roughCanvas.line(
          handles[1].x + HANDLE_SIZE / 2,
          handles[1].y,
          handles[2].x + HANDLE_SIZE / 2,
          handles[2].y,
          options
        );
        this.roughCanvas.line(
          handles[2].x,
          handles[2].y + HANDLE_SIZE / 2,
          handles[3].x,
          handles[3].y + HANDLE_SIZE / 2,
          options
        );
        this.roughCanvas.line(
          handles[3].x - HANDLE_SIZE / 2,
          handles[3].y,
          handles[0].x - HANDLE_SIZE / 2,
          handles[0].y,
          options
        );
        break;
      case ToolType.Line:
      case ToolType.Arrow:
        handles = [
          {
            x: shape.sX + panX,
            y: shape.sY + panY,
            type: "start",
          },
          {
            x: shape.mX + panX,
            y: shape.mY + panY,
            type: "mid",
          },
          {
            x: shape.eX + panX,
            y: shape.eY + panY,
            type: "end",
          },
        ];
        handles.forEach((handle) => {
          this.roughCanvas.ellipse(
            handle.x,
            handle.y,
            HANDLE_SIZE,
            HANDLE_SIZE,
            {
              fillStyle: "transparent",
              stroke: "#a8a5ff",
              strokeWidth: 2,
              roughness: 0,
            }
          );
        });
        handles = [
          {
            x: Math.min(shape.startX, shape.endX) + panX,
            y: Math.min(shape.startY, shape.endY) + panY,
            type: "nw",
          },
          {
            x: Math.max(shape.startX, shape.endX) + panX,
            y: Math.min(shape.startY, shape.endY) + panY,
            type: "ne",
          },
          {
            x: Math.max(shape.startX, shape.endX) + panX,
            y: Math.max(shape.startY, shape.endY) + panY,
            type: "se",
          },
          {
            x: Math.min(shape.startX, shape.endX) + panX,
            y: Math.max(shape.startY, shape.endY) + panY,
            type: "sw",
          },
        ];
        handles.forEach((handle) => {
          switch (handle.type) {
            case "nw":
              this.roughCanvas.rectangle(
                handle.x - HANDLE_SIZE,
                handle.y - HANDLE_SIZE,
                HANDLE_SIZE,
                HANDLE_SIZE,
                options
              );
              break;
            case "ne":
              this.roughCanvas.rectangle(
                handle.x,
                handle.y - HANDLE_SIZE,
                HANDLE_SIZE,
                HANDLE_SIZE,
                options
              );
              break;
            case "se":
              this.roughCanvas.rectangle(
                handle.x,
                handle.y,
                HANDLE_SIZE,
                HANDLE_SIZE,
                options
              );
              break;
            case "sw":
              this.roughCanvas.rectangle(
                handle.x - HANDLE_SIZE,
                handle.y,
                HANDLE_SIZE,
                HANDLE_SIZE,
                options
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
          options
        );
        this.roughCanvas.line(
          handles[1].x + HANDLE_SIZE / 2,
          handles[1].y,
          handles[2].x + HANDLE_SIZE / 2,
          handles[2].y,
          options
        );
        this.roughCanvas.line(
          handles[2].x,
          handles[2].y + HANDLE_SIZE / 2,
          handles[3].x,
          handles[3].y + HANDLE_SIZE / 2,
          options
        );
        this.roughCanvas.line(
          handles[3].x - HANDLE_SIZE / 2,
          handles[3].y,
          handles[0].x - HANDLE_SIZE / 2,
          handles[0].y,
          options
        );
        break;
        break;
      default:
        break;
    }
  }

  public redrawShapes(
    selectedShapeIndex: number | null,
    panX: number,
    panY: number
  ): void {
    const ctx = this.canvas.getContext("2d");

    ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.shapes.forEach((shape, index) => {
      const isSelected = selectedShapeIndex === index;
      const options = {
        isDeleted: false,
        stroke: shape.isDeleted
          ? hexToRgba(shape.stroke ?? "#ffffff", 0.3)
          : shape.stroke,
        strokeWidth: shape.strokeWidth,
        roughness: shape.sloppiness,
        fill:
          shape.fill === "transparent"
            ? shape.fill
            : shape.isDeleted
              ? hexToRgba(shape.fill ?? "#ffffff", 0.3)
              : shape.fill,
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
            shape.startX + panX,
            shape.startY + panY,
            shape.endX - shape.startX,
            shape.endY - shape.startY,
            shape.edgeType
          );
          this.roughCanvas.path(path, options);
          break;
        case ToolType.Ellipse:
          this.roughCanvas.ellipse(
            (shape.startX + shape.endX + 2 * panX) / 2,
            (shape.startY + shape.endY + 2 * panY) / 2,
            shape.endX - shape.startX,
            shape.endY - shape.startY,
            options
          );
          break;
        case ToolType.Diamond:
          const points = this.getDiamondPoints(
            (shape.startX + shape.endX + 2 * panX) / 2,
            (shape.startY + shape.endY + 2 * panY) / 2,
            (shape.endX - shape.startX) / 2,
            (shape.endY - shape.startY) / 2
          );
          this.roughCanvas.polygon(points, options);
          break;
        case ToolType.Line:
          this.roughCanvas.line(
            shape.sX + panX,
            shape.sY + panY,
            shape.mX + panX,
            shape.mY + panY,
            options
          );
          this.roughCanvas.line(
            shape.mX + panX,
            shape.mY + panY,
            shape.eX + panX,
            shape.eY + panY,
            options
          );
          break;
        case ToolType.Arrow:
          this.roughCanvas.line(
            shape.sX + panX,
            shape.sY + panY,
            shape.mX + panX,
            shape.mY + panY,
            options
          );
          this.drawLineWithArrow(
            shape.mX + panX,
            shape.mY + panY,
            shape.eX + panX,
            shape.eY + panY,
            shape.arrowType,
            options,
            shape.stroke
          );
          break;
        case ToolType.Pencil:
          this.drawWithPencil(shape.points, panX, panY, options);
          break;
        case ToolType.Text:
          this.renderText2(shape, panX, panY);
          break;
        default:
          break;
      }

      if (isSelected) {
        this.drawResizeHandles(shape, panX, panY);
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
    panX: number,
    panY: number,
    options: ShapeOptions
  ) {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;
    if (points.length < 2) return;

    points = points.map((point) => [point[0] + panX, point[1] + panY]);
    const stroke = getStroke(points, {
      size: options.strokeWidth ? options.strokeWidth * 5 : 4,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
    });

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

  private renderText2(txt: Text, panX: number, panY: number) {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;
    txt = {
      ...txt,
      x: txt.x + panX,
      y: txt.y + panY,
    };
    ctx.font = `${txt.fontSize}px ${txt.fontFamily}`;
    ctx.fillStyle = hexToRgba(txt.color, txt.isDeleted ? 0.3 : 1);

    const lines = txt.text.split("\n");
    const lineHeight = txt.fontSize * txt.lineHeight;

    lines.forEach((line, index) => {
      const y = txt.y + index * lineHeight + txt.fontSize;
      ctx.fillText(line, txt.x, y);
    });
  }

  public renderText(
    txt: Shape,
    panX: number,
    panY: number,
    activeTextId: string | null,
    selectionStart: number | null,
    selectionEnd: number | null,
    isEditing: boolean,
    cursorPosition: number | undefined,
    showCursor: boolean,
    getCursorCoordinates: (
      txt: Text,
      textIndex: number
    ) => { x: number; y: number }
  ) {
    if (!this.canvas || txt.type !== ToolType.Text) return;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;
    txt = {
      ...txt,
      x: txt.x + panX,
      y: txt.y + panY,
    };
    ctx.font = `${txt.fontSize}px ${txt.fontFamily}`;
    ctx.fillStyle = hexToRgba(txt.color);

    const lines = txt.text.split("\n");
    const lineHeight = txt.fontSize * txt.lineHeight;

    lines.forEach((line, index) => {
      const y = txt.y + index * lineHeight + txt.fontSize;
      ctx.fillText(line, txt.x, y);

      if (
        txt.id === activeTextId &&
        selectionStart !== null &&
        selectionEnd !== null
      ) {
        const start = Math.min(selectionStart, selectionEnd);
        const end = Math.max(selectionStart, selectionEnd);

        let currentIndex = 0;
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
          const line = lines[lineIndex];
          const lineStart = currentIndex;
          const lineEnd = currentIndex + line.length;

          if (start <= lineEnd && end >= lineStart) {
            const selStart = Math.max(start - lineStart, 0);
            const selEnd = Math.min(end - lineStart, line.length);
            if (selStart < selEnd) {
              const beforeSelection = line.substring(0, selStart);
              const selection = line.substring(selStart, selEnd);

              const x1 = txt.x + ctx.measureText(beforeSelection).width;
              const y1 = txt.y + lineIndex * lineHeight;
              const width = ctx.measureText(selection).width;

              ctx.save();
              ctx.fillStyle = hexToRgba("#E3E3E8", 0.1);
              ctx.fillRect(x1, y1, width, lineHeight);
              ctx.restore();
            }
          }

          currentIndex += line.length + 1;
        }
      }
      if (
        txt.id === activeTextId &&
        isEditing &&
        selectionStart === null &&
        showCursor
      ) {
        const cursorCoords = getCursorCoordinates(txt, cursorPosition!);

        ctx.strokeStyle = txt.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cursorCoords.x, cursorCoords.y);
        ctx.lineTo(
          cursorCoords.x,
          cursorCoords.y + txt.fontSize * txt.lineHeight
        );
        ctx.stroke();
      }
    });
  }

  public drawShape(shape: Shape, panX: number, panY: number): void {
    const options = this.getCanvaOptions();
    switch (shape.type) {
      case ToolType.Rectangle:
        const path = this.roundedRectPath(
          shape.startX + panX,
          shape.startY + panY,
          shape.endX - shape.startX,
          shape.endY - shape.startY,
          shape.edgeType
        );
        this.roughCanvas.path(path, options);
        break;
      case ToolType.Ellipse:
        this.roughCanvas.ellipse(
          (shape.startX + shape.endX + 2 * panX) / 2,
          (shape.startY + shape.endY + 2 * panY) / 2,
          shape.endX - shape.startX,
          shape.endY - shape.startY,
          options
        );
        break;
      case ToolType.Diamond:
        const points = this.getDiamondPoints(
          (shape.startX + shape.endX + 2 * panX) / 2,
          (shape.startY + shape.endY + 2 * panY) / 2,
          (shape.endX - shape.startX) / 2,
          (shape.endY - shape.startY) / 2
        );
        this.roughCanvas.polygon(points, options);
        break;
      case ToolType.Line:
        this.roughCanvas.line(
          shape.sX + panX,
          shape.sY + panY,
          shape.mX + panX,
          shape.mY + panY,
          options
        );
        this.roughCanvas.line(
          shape.mX + panX,
          shape.mY + panY,
          shape.eX + panX,
          shape.eY + panY,
          options
        );
        break;
      case ToolType.Arrow:
        this.roughCanvas.line(
          shape.sX + panX,
          shape.sY + panY,
          shape.mX + panX,
          shape.mY + panY,
          options
        );
        this.drawLineWithArrow(
          shape.mX + panX,
          shape.mY + panY,
          shape.eX + panX,
          shape.eY + panY,
          shape.arrowType,
          options,
          shape.stroke
        );
        break;
      case ToolType.Pencil:
        this.drawWithPencil(shape.points, panX, panY, options);
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
