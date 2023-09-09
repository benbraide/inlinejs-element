import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "./element";
import { IResourceTargetAdvanced } from "../types";
export declare class ResourceTargetElement extends CustomElement implements IResourceTargetAdvanced {
    protected attributes_: Record<string, string> | null;
    UpdateAttributesProperty(value: Record<string, string> | null): void;
    sequential: boolean;
    defer: boolean;
    constructor();
    LoadTargetResources(): Promise<any>;
    protected HandleElementScopeCreated_(params: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected GetResourceLoadAttributes_(): Record<string, string> | undefined;
    protected IsConcurrentResourceLoad_(): boolean;
    protected ShouldLoadResources_(): boolean;
}
export declare function ResourceTargetElementCompact(): void;
