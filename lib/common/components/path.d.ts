import { ICanvasFigure, ICanvasPosition } from "../types";
import { CanvasParent } from "./parent";
export declare class CanvasPath extends CanvasParent {
    protected ctx_: Path2D | null;
    constructor(state?: Record<string, any>);
    ContainsPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): boolean;
    FindChildWithPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): ICanvasFigure | null;
    GetContext(): CanvasRenderingContext2D | Path2D | null;
    protected Render_(ctx: CanvasRenderingContext2D | Path2D): void;
    protected Fill_(): void;
    protected Project_(ctx: CanvasRenderingContext2D | Path2D): void;
}
export declare function CanvasPathCompact(): void;
