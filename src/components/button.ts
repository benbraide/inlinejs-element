import { CustomElementWrapper } from "./wrapper";

export class CustomButtonElement<ShadowType = Element> extends HTMLButtonElement{
    private wrapper_: CustomElementWrapper<ShadowType>;
    protected state_: Record<string, any> = {};
    
    public constructor(state?: Record<string, any>, allowWatch = false, protected shadow_?: ShadowType){
        super();

        this.wrapper_ = new CustomElementWrapper(this, this.state_, state, allowWatch, shadow_);
        this.wrapper_.SetCallbacks({
            AttributeChanged: (name) => this.AttributeChanged_(name),
            ShouldRefreshOnChange: (name) => this.ShouldRefreshOnChange_(name),
            Refresh: () => this.Refresh_(),
            Cast: (name, value) => this.Cast_(name, value),
        });
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
