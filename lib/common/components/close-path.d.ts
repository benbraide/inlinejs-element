import { CanvasShape } from "./shape";
export declare class CanvasClosePath extends CanvasShape {
    protected Render_(ctx: CanvasRenderingContext2D | Path2D): void;
}
export declare function CanvasClosePathCompact(): void;
