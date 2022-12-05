import { ICanvasFigure, ICanvasPosition } from "../types";
import { CanvasParent } from "./parent";
export declare class CanvasAlign extends CanvasParent {
    constructor();
    OffsetPosition(position: ICanvasPosition, source: ICanvasFigure | null, ctx?: CanvasRenderingContext2D): ICanvasPosition;
}
export declare function CanvasAlignCompact(): void;
