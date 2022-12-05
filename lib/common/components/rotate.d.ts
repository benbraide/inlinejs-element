import { ICanvasFigure, ICanvasPosition } from "../types";
import { CanvasTransform } from "./transform";
export declare class CanvasRotate extends CanvasTransform {
    constructor();
    OffsetPosition(position: ICanvasPosition, source: ICanvasFigure | null, ctx?: CanvasRenderingContext2D): ICanvasPosition;
    protected Cast_(name: string, value: any): any;
    protected Apply_(ctx: CanvasRenderingContext2D | Path2D): void;
}
export declare function CanvasRotateCompact(): void;
