import { IElementScopeCreatedCallbackParams, IMutationObserverAttributeInfo } from "@benbraide/inlinejs";
interface ICustomElementCallbacks {
    AttributeChanged: (name: string) => void;
    ShouldRefreshOnChange: (name: string) => boolean;
    Refresh: () => void;
    Cast: (name: string, value: any) => any;
}
export declare class CustomElementWrapper<ShadowType = Element> {
    private el_;
    private state_;
    private shadow_?;
    private callbacks_;
    constructor(el_: HTMLElement, state_: Record<string, any>, state?: Record<string, any>, shadow_?: ShadowType | undefined);
    OnElementScopeCreated({ scope }: IElementScopeCreatedCallbackParams): void;
    SetCallbacks(callbacks: ICustomElementCallbacks): void;
    AttributeChanged(name: string, external?: boolean): void;
    ShouldRefreshOnChange(name: string, external?: boolean): boolean;
    Refresh(external?: boolean): void;
    Cast(name: string, value: any, external?: boolean): any;
    protected static OnChange_(attributes: Array<IMutationObserverAttributeInfo>): void;
}
export {};
