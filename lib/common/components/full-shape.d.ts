import { CanvasShape } from "./shape";
export declare class CanvasFullShape extends CanvasShape {
    constructor(state?: Record<string, any>);
    protected Paint_(ctx: CanvasRenderingContext2D | Path2D): void;
}
