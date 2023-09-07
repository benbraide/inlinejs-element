import { IResourceMixedItemInfo } from "@benbraide/inlinejs";
export interface INativeElementAttribute {
    name: string;
    value: string;
}
export interface INativeElement {
    GetAttributes(): Array<INativeElementAttribute>;
}
export interface IResourceSource {
    GetResource(): string | IResourceMixedItemInfo;
}
export declare type CustomElementResourceType = string | IResourceMixedItemInfo | IResourceSource | IResourceTarget;
export interface IResourceTarget {
    AddResource(resource: CustomElementResourceType): void;
    RemoveResource(resource: CustomElementResourceType): void;
    LoadResources(): Promise<any>;
}
