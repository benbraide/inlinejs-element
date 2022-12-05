import { ICanvasFigure, ICanvasPosition, ICanvasSize } from "../types";
import { CanvasShape } from "./shape";
export declare class CanvasParent extends CanvasShape {
    constructor(state?: Record<string, any>);
    GetSize(ctx: CanvasRenderingContext2D | null): ICanvasSize;
    FindChildWithPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): ICanvasFigure | null;
    OffsetPosition(position: ICanvasPosition, source: ICanvasFigure | null, ctx?: CanvasRenderingContext2D): ICanvasPosition;
    protected Render_(ctx: CanvasRenderingContext2D | Path2D): void;
    protected OffsetPosition_(position: ICanvasPosition, source: ICanvasFigure | null, ctx?: CanvasRenderingContext2D): ICanvasPosition;
    protected GetChildSize_(ctx: CanvasRenderingContext2D | null): ICanvasSize;
}
