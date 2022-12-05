import { IMutationObserverAttributeInfo } from "@benbraide/inlinejs";
export declare class CustomElement<ShadowType = Element> extends HTMLElement {
    protected shadow_?: ShadowType | undefined;
    protected state_: Record<string, any>;
    constructor(state?: Record<string, any>, shadow_?: ShadowType | undefined);
    protected AttributeChanged_(name: string): void;
    protected ShouldRefreshOnChange_(name: string): boolean;
    protected Refresh_(): void;
    protected Cast_(name: string, value: any): any;
    protected static OnChange_(attributes: Array<IMutationObserverAttributeInfo>): void;
    protected static IsWatchingChange_(update?: boolean): boolean;
}
