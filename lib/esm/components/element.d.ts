import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { IProperty } from "../decorators/property";
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
export declare class CustomElement extends HTMLElement {
    protected options_: ICustomElementOptions;
    protected componentId_: string;
    protected nativeElement_: HTMLElement | null;
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
    AddBooleanAttribute(name: string | Array<string>): void;
    RemoveBooleanAttribute(name: string | Array<string>): void;
    AddNonBooleanAttribute(name: string | Array<string>): void;
    RemoveNonBooleanAttribute(name: string | Array<string>): void;
    IsBooleanAttribute(name: string): boolean | null;
    IsTemplate(): boolean | undefined;
    OnElementScopeCreated(params: IElementScopeCreatedCallbackParams): void;
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
    static GlobalAttributes: string[];
}
