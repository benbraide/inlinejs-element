import { IElementScopeCreatedCallbackParams, IResourceMixedItemInfo } from "@benbraide/inlinejs";
import { CustomElement } from "./element";
import { IResourceSource } from "../types";
export declare class ResourceElement extends CustomElement implements IResourceSource {
    src: string;
    type: string;
    constructor();
    GetResource(): string | IResourceMixedItemInfo;
    protected HandleElementScopeCreated_(params: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected ShouldLoadResources_(): boolean;
}
export declare function ResourceElementCompact(): void;
