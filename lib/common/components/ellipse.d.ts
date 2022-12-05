import { ICanvasSize } from "../types";
import { CanvasPath } from "./path";
export declare class CanvasEllipse extends CanvasPath {
    constructor();
    GetSize(ctx: CanvasRenderingContext2D | null): ICanvasSize;
    GetFixedSize(ctx: CanvasRenderingContext2D | null): ICanvasSize;
    protected Cast_(name: string, value: any): any;
    protected Fill_(): void;
}
export declare function CanvasEllipseCompact(): void;
