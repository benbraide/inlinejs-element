import { ICanvasPosition, ICanvasSize } from "../types";
import { CanvasFullShape } from "./full-shape";
export declare class CanvasText extends CanvasFullShape {
    private font_;
    private size_;
    constructor();
    GetSize(ctx: CanvasRenderingContext2D | null): ICanvasSize;
    GetFixedSize(ctx: CanvasRenderingContext2D | null): ICanvasSize;
    ContainsPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): boolean;
    protected Render_(ctx: CanvasRenderingContext2D | Path2D): void;
    protected AttributeChanged_(name: string): void;
    private ApplyStyles_;
    private ComputeFont_;
    private ComputeValue_;
}
export declare function CanvasTextCompact(): void;
