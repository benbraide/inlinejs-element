import { CustomElement } from "./element";
import { IResourceTargetAdvanced } from "../types";
export declare class ResourceTargetElement extends CustomElement implements IResourceTargetAdvanced {
    protected attributes_: Record<string, string> | null;
    UpdateAttributesProperty(value: Record<string, string> | null): void;
    sequential: boolean;
    defer: boolean;
    onloaded: string;
    onloadederror: string;
    constructor();
    LoadResources(): Promise<unknown>;
    LoadTargetResources(): Promise<unknown>;
    protected HandlePostAttributesProcessPostfix_(): void;
    protected GetResourceLoadAttributes_(): Record<string, string> | undefined;
    protected IsConcurrentResourceLoad_(): boolean;
    protected ShouldLoadResources_(): boolean;
}
export declare function ResourceTargetElementCompact(): void;
