import { ICanvasSize } from "../types";
import { CanvasFullShape } from "./full-shape";
export declare class CanvasImage extends CanvasFullShape {
    private object_;
    constructor();
    protected AttributeChanged_(name: string): void;
    protected Render_(ctx: CanvasRenderingContext2D | Path2D): void;
    protected ResolveSize_(): ICanvasSize;
    protected ResolvePart_(value: string, target: number, otherValue: number, aspectRatio: number): number;
}
export declare function CanvasImageCompact(): void;
