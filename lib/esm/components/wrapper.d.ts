import { IMutationObserverAttributeInfo } from "@benbraide/inlinejs";
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
    constructor(el_: HTMLElement, state_: Record<string, any>, state?: Record<string, any>, allowWatch?: boolean, shadow_?: ShadowType | undefined);
    SetCallbacks(callbacks: ICustomElementCallbacks): void;
    AttributeChanged(name: string, external?: boolean): void;
    ShouldRefreshOnChange(name: string, external?: boolean): boolean;
    Refresh(external?: boolean): void;
    Cast(name: string, value: any, external?: boolean): any;
    protected static OnChange_(attributes: Array<IMutationObserverAttributeInfo>): void;
    protected static IsWatchingChange_(update?: boolean): boolean;
}
export {};
