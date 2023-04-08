import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElementWrapper } from "./wrapper";

export class CustomAnchorElement<ShadowType = Element> extends HTMLAnchorElement{
    protected wrapper_: CustomElementWrapper<ShadowType>;
    protected state_: Record<string, any> = {};
    
    public constructor(state?: Record<string, any>, protected shadow_?: ShadowType){
        super();

        this.wrapper_ = new CustomElementWrapper(this, this.state_, state, shadow_);
        this.wrapper_.SetCallbacks({
            AttributeChanged: (name) => this.AttributeChanged_(name),
            ShouldRefreshOnChange: (name) => this.ShouldRefreshOnChange_(name),
            Refresh: () => this.Refresh_(),
            Cast: (name, value) => this.Cast_(name, value),
        });
    }

    public IsBooleanAttribute(name: string){
        return this.wrapper_.IsBooleanAttribute(name);
    }

    public OnElementScopeCreated(params: IElementScopeCreatedCallbackParams){
        this.wrapper_.OnElementScopeCreated(params);
    }

    protected AttributeChanged_(name: string){
        this.wrapper_.AttributeChanged(name, true);
    }

    protected ShouldRefreshOnChange_(name: string){
        return this.wrapper_.ShouldRefreshOnChange(name, true);
    }

    protected Refresh_(){}

    protected Cast_(name: string, value: any){
        return this.wrapper_.Cast(name, value, true);
    }
}
