import { ICanvasSize } from "../types";
import { CanvasPath } from "./path";
export declare class CanvasCircle extends CanvasPath {
    constructor();
    GetSize(ctx: CanvasRenderingContext2D | null): ICanvasSize;
    GetFixedSize(ctx: CanvasRenderingContext2D | null): ICanvasSize;
    GetRadius(): any;
    protected Fill_(): void;
}
export declare function CanvasCircleCompact(): void;
