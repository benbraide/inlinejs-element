import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { INativeElement, INativeElementAttribute } from "../types";
import { CustomElement } from "./element";
export declare class NativeElement extends CustomElement implements INativeElement {
    protected attributes_: INativeElementAttribute[];
    constructor();
    GetAttributes(): INativeElementAttribute[];
    protected HandleElementScopeCreated_(params: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
}
export declare function NativeElementCompact(): void;
