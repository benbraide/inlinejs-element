import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
export declare class CustomElement<ShadowType extends Element = Element> extends HTMLElement {
    protected shadow_?: ShadowType | undefined;
    protected isTemplate_: boolean;
    protected componentId_: string;
    protected state_: Record<string, any>;
    protected booleanAttributes_: string[];
    protected nonBooleanAttributes_: string[];
    constructor(state?: Record<string, any>, shadow_?: ShadowType | undefined, initializeBooleanAttributes?: boolean, disableImplicitData?: boolean, isTemplate_?: boolean);
    AddBooleanAttribute(name: string | Array<string>): void;
    RemoveBooleanAttribute(name: string | Array<string>): void;
    AddNonBooleanAttribute(name: string | Array<string>): void;
    RemoveNonBooleanAttribute(name: string | Array<string>): void;
    IsBooleanAttribute(name: string): boolean | null;
    IsTemplate(): boolean;
    OnElementScopeCreated({ scope, component, componentId }: IElementScopeCreatedCallbackParams): void;
    protected InitializeBooleanAttributesFromState_(except?: Array<string>): void;
    protected InitializeStateFromAttributes_(whitelist?: Array<string>): void;
    protected AttributeChanged_(name: string): void;
    protected ShouldRefreshOnChange_(name: string): boolean;
    protected Refresh_(): void;
    protected Cast_(name: string, value: any): any;
}
