import { ICanvasFigure, ICanvasPosition, ICanvasScaleValue } from "../types";
import { CanvasTransform } from "./transform";
export declare class CanvasScale extends CanvasTransform {
    constructor();
    OffsetPosition(position: ICanvasPosition, source: ICanvasFigure | null, ctx?: CanvasRenderingContext2D): any;
    FindChildWithPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): ICanvasFigure | null;
    GetTransformScale(): ICanvasScaleValue;
    protected Apply_(ctx: CanvasRenderingContext2D | Path2D): void;
}
export declare function CanvasScaleCompact(): void;
