import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
export declare class CustomAnchorElement<ShadowType = Element> extends HTMLAnchorElement {
    protected shadow_?: ShadowType | undefined;
    private wrapper_;
    protected state_: Record<string, any>;
    constructor(state?: Record<string, any>, shadow_?: ShadowType | undefined);
    OnElementScopeCreated(params: IElementScopeCreatedCallbackParams): void;
    protected AttributeChanged_(name: string): void;
    protected ShouldRefreshOnChange_(name: string): boolean;
    protected Refresh_(): void;
    protected Cast_(name: string, value: any): any;
}