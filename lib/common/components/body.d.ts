import { CanvasBodyDirection, ICanvasPosition } from "../types";
import { CanvasParent } from "./parent";
export declare class CanvasBody extends CanvasParent {
    protected dispatching_: boolean;
    protected direction_: CanvasBodyDirection;
    constructor();
    GetShape(): "rect" | "circle";
    GetRadius(): any;
    Reset(position: ICanvasPosition, direction: CanvasBodyDirection): void;
    Step(): void;
    protected AttributeChanged_(name: string): void;
    protected DispatchEvent_(): void;
    protected CheckCollision_(source: CanvasBody): void;
    protected CheckCirclesCollision_(source: CanvasBody): boolean;
    protected CheckCircleRectCollision_(circle: CanvasBody, rect: CanvasBody): boolean;
    protected CheckRectsCollision_(source: CanvasBody): boolean;
    protected HandleCollision_(source: CanvasBody): void;
    protected HandleHCollision_(orientation: string): void;
    protected HandleVCollision_(orientation: string): void;
    protected HandleChaseCollision_(source: CanvasBody): void;
    protected HandleCrashCollision_(source: CanvasBody): void;
    protected Step_(dispatch?: boolean): void;
    protected ApplySteps_(steps: number): void;
    protected ReverseDirection_(): void;
}
export declare function CanvasBodyCompact(): void;
