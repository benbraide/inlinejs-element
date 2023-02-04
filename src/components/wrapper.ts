import { IElementScopeCreatedCallbackParams, IMutationObserverAttributeInfo, IsObject, ToCamelCase, ToString } from "@benbraide/inlinejs";
import { GetKeys } from "../utilities/get-keys";
import { KeyExists } from "../utilities/key-exists";
import { SetValue } from "../utilities/set-value";

interface ICustomElementCallbacks{
    AttributeChanged: (name: string) => void;
    ShouldRefreshOnChange: (name: string) => boolean;
    Refresh: () => void;
    Cast: (name: string, value: any) => any;
}

export class CustomElementWrapper<ShadowType = Element>{
    private callbacks_: ICustomElementCallbacks | null = null;

    public constructor(private el_: HTMLElement, private state_: Record<string, any>, state?: Record<string, any>, private shadow_?: ShadowType){
        state && Object.entries(state).forEach(([key, value]) => (this.state_[key] = value));
    }

    public OnElementScopeCreated({ scope }: IElementScopeCreatedCallbackParams){
        scope.AddAttributeChangeCallback((attrName) => {
            if (!attrName){
                return;
            }

            let callbackName = `${ToCamelCase(attrName, true, '-')}Changed`;// E.g 'SizeChanged'
            if (callbackName in this.el_ && typeof this.el_[callbackName] === 'function'){
                this.el_[callbackName]();
            }
            else if (KeyExists(attrName, this.state_)){
                this.callbacks_?.AttributeChanged(attrName);
            }
        });
    }

    public SetCallbacks(callbacks: ICustomElementCallbacks){
        let keys = GetKeys(this.state_);
        
        this.callbacks_ = callbacks;
        Array.from(this.el_.attributes).filter(attr => keys.includes(attr.name)).forEach((attr) => {//Initialize state from attributes
            let [key, value] = (SetValue(this.state_, attr.name, this.Cast(attr.name, attr.value)) || []);
            if (key && IsObject(value)){
                Object.entries(value).forEach(([key, value]) => (this.shadow_ && (this.shadow_ as unknown as Element).setAttribute(key, ToString(value))));
            }
            else if (key){
                (this.shadow_ && (this.shadow_ as unknown as Element).setAttribute(key, ToString(value)));
            }
        });
    }

    public AttributeChanged(name: string, external = false){
        if (!external){
            this.callbacks_?.AttributeChanged(name);
            return;
        }
        
        let [key, value] = (SetValue(this.state_, name, this.Cast(name, (this.el_.getAttribute(name) || ''))) || []);
        if (key){//State updated
            if (IsObject(value)){
                Object.entries(value).forEach(([key, value]) => (this.shadow_ && (this.shadow_ as unknown as Element).setAttribute(key, ToString(value))));
            }
            else{
                (this.shadow_ && (this.shadow_ as unknown as Element).setAttribute(key, ToString(value)));
            }

            (this.ShouldRefreshOnChange(key) && this.Refresh());//Refresh if possible
        }
    }

    public ShouldRefreshOnChange(name: string, external = false){
        return (external ? true : (this.callbacks_?.ShouldRefreshOnChange(name) || false));
    }

    public Refresh(external = false){
        !external && this.callbacks_?.Refresh();
    }

    public Cast(name: string, value: any, external = false){
        if (!external){
            return this.callbacks_?.Cast(name, value);
        }
        return ((this.state_.hasOwnProperty(name) && typeof this.state_[name] === 'boolean') ? this.el_.hasAttribute(name) : value);
    }

    protected static OnChange_(attributes: Array<IMutationObserverAttributeInfo>){
        attributes.forEach((attr) => {
            let formattedName = attr.name.split('-').reduce((prev, cur) => (prev + (cur.at(0) || '').toUpperCase() + (cur.substring(1) || '')), '');
            if (typeof attr.target[`${formattedName}Changed`] === 'function'){// E.g 'SizeChanged'
                attr.target[`${formattedName}Changed`]();
            }
            else if (KeyExists(attr.name, (attr.target as unknown as CustomElementWrapper).state_)){
                (attr.target as any).AttributeChanged_(attr.name);
            }
        });
    }
}
