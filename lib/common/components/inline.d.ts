import { CanvasParent } from "./parent";
export declare class CanvasInline extends CanvasParent {
    constructor();
    protected Cast_(name: string, value: any): any;
    protected Render_(ctx: CanvasRenderingContext2D | Path2D): void;
}
export declare function CanvasInlineCompact(): void;
