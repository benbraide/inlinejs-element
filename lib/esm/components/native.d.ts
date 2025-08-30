import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { INativeElement, INativeElementAttribute } from "../types";
import { CustomElement } from "./element";
export declare class NativeElement extends CustomElement implements INativeElement {
    protected attributes_: INativeElementAttribute[];
    constructor();
    GetAttributes(): INativeElementAttribute[];
    protected HandleElementScopeCreatedPrefix_(params: IElementScopeCreatedCallbackParams): void;
}
export declare function NativeElementCompact(): void;
