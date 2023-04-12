import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
export declare class CustomElement<ShadowType extends Element = Element> extends HTMLElement {
    protected shadow_?: ShadowType | undefined;
    protected state_: Record<string, any>;
    protected booleanAttributes_: string[];
    protected nonBooleanAttributes_: string[];
    constructor(state?: Record<string, any>, shadow_?: ShadowType | undefined);
    AddBooleanAttribute(name: string): void;
    RemoveBooleanAttribute(name: string): void;
    AddNonBooleanAttribute(name: string): void;
    RemoveNonBooleanAttribute(name: string): void;
    IsBooleanAttribute(name: string): boolean | null;
    OnElementScopeCreated({ scope }: IElementScopeCreatedCallbackParams): void;
    protected AttributeChanged_(name: string): void;
    protected ShouldRefreshOnChange_(name: string): boolean;
    protected Refresh_(): void;
    protected Cast_(name: string, value: any): any;
}
