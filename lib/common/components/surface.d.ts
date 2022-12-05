import { ICanvasComponent, ICanvasSize } from "../types";
import { CanvasAttributed } from "./attributed";
export declare class CanvasSurface extends CanvasAttributed<HTMLCanvasElement> implements ICanvasComponent {
    private ctx_;
    private withMouse_;
    private mouseOffset_;
    private rendered_;
    private queued_;
    private requested_;
    constructor();
    GetComponentChildren(): ICanvasComponent[];
    Render(): void;
    Refresh(): void;
    GetContext(): CanvasRenderingContext2D | null;
    GetSurfaceContext(): CanvasRenderingContext2D | null;
    GetSurfaceSize(): any;
    GetSize(): ICanvasSize;
    GetFixedSize(): ICanvasSize;
    GetNative(): HTMLCanvasElement | undefined;
    protected AttributeChanged_(name: string): void;
    private Render_;
    private FindWithMouse_;
    private UpdateWithMouse_;
    private RemoveWithMouse_;
    private VsyncCallback_;
}
export declare function CanvasSurfaceCompact(): void;
