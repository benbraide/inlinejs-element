export declare class CustomTextareaElement<ShadowType = Element> extends HTMLTextAreaElement {
    protected shadow_?: ShadowType | undefined;
    private wrapper_;
    protected state_: Record<string, any>;
    constructor(state?: Record<string, any>, allowWatch?: boolean, shadow_?: ShadowType | undefined);
    protected AttributeChanged_(name: string): void;
    protected ShouldRefreshOnChange_(name: string): boolean;
    protected Refresh_(): void;
    protected Cast_(name: string, value: any): any;
}
