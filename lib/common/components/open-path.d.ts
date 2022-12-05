import { CanvasParent } from "./parent";
export declare class CanvasOpenPath extends CanvasParent {
    constructor(state?: Record<string, any>);
    protected Render_(ctx: CanvasRenderingContext2D | Path2D): void;
    protected Project_(ctx: CanvasRenderingContext2D | Path2D): void;
}
export declare function CanvasOpenPathCompact(): void;
