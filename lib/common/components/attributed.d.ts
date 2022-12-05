import { IMutationObserverAttributeInfo } from "@benbraide/inlinejs";
export declare class CanvasAttributed<ShadowType = Element> extends HTMLElement {
    protected shadow_?: ShadowType | undefined;
    protected state_: Record<string, any>;
    constructor(state?: Record<string, any>, shadow_?: ShadowType | undefined);
    protected OnChange_(attributes: Array<IMutationObserverAttributeInfo>): void;
    protected AttributeChanged_(name: string): void;
    protected ShouldRefreshOnChange_(name: string): boolean;
    protected Refresh_(): void;
    protected Cast_(name: string, value: any): any;
}
