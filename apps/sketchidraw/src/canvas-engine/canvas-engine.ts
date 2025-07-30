export class CanvasEngine {
  private canvas: HTMLCanvasElement | null;
  private shapes: [];
  private stColor: string | null;
  private bgColor: string | null;

  constructor(canvas: HTMLCanvasElement) {
    this.shapes = [];
    this.stColor = "";
    this.bgColor = "";
    this.canvas = canvas;
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
}
