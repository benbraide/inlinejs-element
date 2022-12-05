import { ICanvasComponent, ICanvasFigure, ICanvasPosition, ICanvasRect, ICanvasScaleValue, ICanvasShape, ICanvasSize } from "../types";
import { CanvasAttributed } from "./attributed";
export declare class CanvasShape extends CanvasAttributed implements ICanvasShape {
    constructor(state?: Record<string, any>);
    GetComponentChildren(): ICanvasComponent[];
    GetFigureChildren(): ICanvasFigure[];
    GetPosition(): ICanvasPosition;
    GetOffsetPosition(ctx?: CanvasRenderingContext2D): ICanvasPosition;
    GetContext(): CanvasRenderingContext2D | Path2D | null;
    GetSurfaceContext(): CanvasRenderingContext2D | null;
    GetSurfaceSize(): ICanvasSize;
    GetSize(ctx: CanvasRenderingContext2D | null): ICanvasSize;
    GetFixedSize(ctx: CanvasRenderingContext2D | null): ICanvasSize;
    GetRect(ctx: CanvasRenderingContext2D | null): ICanvasRect;
    OffsetPosition(position: ICanvasPosition, source: ICanvasFigure | null, ctx?: CanvasRenderingContext2D): ICanvasPosition;
    ContainsPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): boolean;
    FindChildWithPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): ICanvasFigure | null;
    GetTransformScale(): ICanvasScaleValue;
    GetShapeChildren(): ICanvasShape[];
    Paint(ctx: CanvasRenderingContext2D | Path2D): void;
    protected Paint_(ctx: CanvasRenderingContext2D | Path2D): void;
    protected Render_(ctx: CanvasRenderingContext2D | Path2D): void;
    protected Refresh_(): void;
    protected GetOffsetPosition_(ctx?: CanvasRenderingContext2D): ICanvasPosition;
    protected GetUnscaledOffsetPosition_(ctx?: CanvasRenderingContext2D): ICanvasPosition;
    protected GetParentSize_(ctx: CanvasRenderingContext2D | null): ICanvasSize;
}
