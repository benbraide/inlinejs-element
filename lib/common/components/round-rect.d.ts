import { CanvasPath } from "./path";
export declare class CanvasRoundRect extends CanvasPath {
    constructor();
    protected AttributeChanged_(name: string): void;
    protected UpdateParts_(radiusUpdated: boolean): void;
}
export declare function CanvasRoundRectCompact(): void;
