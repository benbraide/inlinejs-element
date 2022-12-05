import { ICanvasFigure, ICanvasPosition } from "../types";
import { CanvasParent } from "./parent";
export declare class CanvasTransform extends CanvasParent {
    constructor(state?: Record<string, any>);
    FindChildWithPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): ICanvasFigure | null;
    OffsetPosition(position: ICanvasPosition, source: ICanvasFigure | null, ctx?: CanvasRenderingContext2D): ICanvasPosition;
    protected Render_(ctx: CanvasRenderingContext2D | Path2D): void;
    protected Apply_(ctx: CanvasRenderingContext2D | Path2D): void;
    protected FindChildWithPoint_(point: ICanvasPosition, ctx: CanvasRenderingContext2D): ICanvasFigure | null;
    protected Translate_(ctx: CanvasRenderingContext2D | Path2D, position?: ICanvasPosition): void;
}
