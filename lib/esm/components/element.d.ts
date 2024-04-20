import { GeneratedFunctionType, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { IProperty } from "../decorators/property";
import { INativeElement, IResourceTarget, CustomElementResourceType } from "../types";
export interface ICustomElementOptions {
    disableImplicitData?: boolean;
    isTemplate?: boolean;
    isHidden?: boolean;
}
export declare type ICustomElementAttributeChangeHandlerCallback = (value: any, context: HTMLElement) => void;
export interface ICustomElementAttributeChangeHandlerInfo {
    handler: ICustomElementAttributeChangeHandlerCallback;
    type?: string;
    checkStoredObject?: boolean;
}
export interface ICustomElementEvaluateOptions {
    disableFunctionCall?: boolean;
    waitPromise?: 'none' | 'default' | 'recursive';
    voidOnly?: boolean;
    callback?: (data: any) => void;
    params?: any[];
    contexts?: Record<string, any>;
}
export declare class CustomElement extends HTMLElement implements IResourceTarget {
    protected options_: ICustomElementOptions;
    protected componentId_: string;
    protected storedProxyAccessHandler_: ((callback: () => void) => void) | null;
    protected resources_: CustomElementResourceType[];
    protected loadedResources_: any;
    protected loadingResources_: boolean;
    protected queuedResourceHandlers_: (() => void)[];
    protected nativeElement_: HTMLElement | null;
    protected nativeElements_: (INativeElement & HTMLElement)[];
    protected nativeAttributesBlacklist_: string[];
    protected nativeAttributesWhitelist_: string[];
    protected propertyScopes_: string[];
    protected instanceProperties_: IProperty[];
    protected instancePropertyNames_: string[];
    protected attributeChangeHandlers_: Record<string, Array<ICustomElementAttributeChangeHandlerInfo>>;
    protected spreads_: Record<string, Array<string>>;
    protected storedObjects_: Record<string, string>;
    protected booleanAttributes_: string[];
    protected nonBooleanAttributes_: string[];
    UpdateComponentProperty(value: string): void;
    constructor(options_?: ICustomElementOptions);
    AddResource(resource: CustomElementResourceType): void;
    RemoveResource(resource: CustomElementResourceType): void;
    LoadResources(): Promise<any>;
    AddNativeElement(element: INativeElement & HTMLElement): void;
    RemoveNativeElement(element: INativeElement): void;
    AddBooleanAttribute(name: string | Array<string>): void;
    RemoveBooleanAttribute(name: string | Array<string>): void;
    AddNonBooleanAttribute(name: string | Array<string>): void;
    RemoveNonBooleanAttribute(name: string | Array<string>): void;
    IsBooleanAttribute(name: string): boolean | null;
    IsTemplate(): boolean | undefined;
    OnElementScopeCreated(params: IElementScopeCreatedCallbackParams): void;
    EvaluateExpression(expression: string, options?: ICustomElementEvaluateOptions): any;
    EvaluateWithStoredProxyAccessHandler(fn: GeneratedFunctionType, callback?: (data: any) => void, params?: any[], contexts?: Record<string, any>): any;
    protected AddPropertyScope_(name: string): void;
    protected FindProperty_(name: string): IProperty | undefined;
    protected GetAllProperties_(): IProperty[];
    protected HandleElementScopeCreated_({ scope, componentId }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected InitializeStateFromAttributes_(whitelist?: Array<string>): void;
    protected EncodeValue_(value: any, type: string): any;
    protected DecodeValue_(value: string | null, type: string, delimiter?: string): any;
    protected SpreadValue_(value: string, keys: Array<string>): void;
    protected DispatchAttributeChange_(name: string, value: string | null): boolean | undefined;
    protected AttributeChanged_(name: string): void;
    protected ComputePropertyScopes_(): string[];
    protected SetNativeElement_(element: HTMLElement | null): void;
    protected CopyNativeElements_(element?: INativeElement & HTMLElement): void;
    protected GetResourceLoadAttributes_(): Record<string, string> | undefined;
    protected IsConcurrentResourceLoad_(): boolean;
    protected ShouldLoadResources_(): boolean;
    static GlobalAttributes: string[];
}
