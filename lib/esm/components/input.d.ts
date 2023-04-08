import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElementWrapper } from "./wrapper";
export declare class CustomInputElement<ShadowType = Element> extends HTMLInputElement {
    protected shadow_?: ShadowType | undefined;
    protected wrapper_: CustomElementWrapper<ShadowType>;
    protected state_: Record<string, any>;
    constructor(state?: Record<string, any>, shadow_?: ShadowType | undefined);
    IsBooleanAttribute(name: string): boolean | null;
    OnElementScopeCreated(params: IElementScopeCreatedCallbackParams): void;
    protected AttributeChanged_(name: string): void;
    protected ShouldRefreshOnChange_(name: string): boolean;
    protected Refresh_(): void;
    protected Cast_(name: string, value: any): any;
}
