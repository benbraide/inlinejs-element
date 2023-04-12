import { GetGlobal, IElementScopeCreatedCallbackParams, IsObject, ToCamelCase, ToString } from "@benbraide/inlinejs";
import { KeyExists } from "../utilities/key-exists";
import { GetKeys } from "../utilities/get-keys";
import { SetValue } from "../utilities/set-value";
import { ValueCast } from "../utilities/value-cast";

export class CustomElement<ShadowType extends Element = Element> extends HTMLElement{
    protected state_: Record<string, any> = {};

    protected booleanAttributes_ = new Array<string>();
    protected nonBooleanAttributes_ = new Array<string>();
    
    public constructor(state?: Record<string, any>, protected shadow_?: ShadowType){
        super();

        state && Object.entries(state).forEach(([key, value]) => (this.state_[key] = value));

        const keys = GetKeys(this.state_);
        Array.from(this.attributes).filter(attr => keys.includes(attr.name)).forEach((attr) => {//Initialize state from attributes
            let [key, value] = (SetValue(this.state_, attr.name, this.Cast_(attr.name, attr.value), false) || []);
            if (key && IsObject(value)){
                Object.entries(value).forEach(([key, value]) => (this.shadow_ && this.shadow_.setAttribute(key, ToString(value))));
            }
            else if (key){
                (this.shadow_ && this.shadow_.setAttribute(key, ToString(value)));
            }
        });

        if (!('InlineJS' in globalThis) || !IsObject(globalThis['InlineJS']) || !globalThis['InlineJS']['disableImplicitData']){
            const dataDirective = GetGlobal().GetConfig().GetDirectiveName('data', false);
            const altDataDirective = GetGlobal().GetConfig().GetDirectiveName('data', true);
            
            let farthestAncestor: Node | null = null;
            for (let ancestor: Node | null = this; ancestor; ancestor = ancestor.parentNode){
                if ((ancestor instanceof Element) && (ancestor.hasAttribute(dataDirective) || ancestor.hasAttribute(altDataDirective))){
                    farthestAncestor = ancestor;
                    break;
                }
            }

            !farthestAncestor && this.setAttribute('x-data', '');
        }
    }

    public AddBooleanAttribute(name: string){
        this.booleanAttributes_.push(name);
    }

    public RemoveBooleanAttribute(name: string){
        this.booleanAttributes_ = this.booleanAttributes_.filter(n => (n !== name));
    }

    public AddNonBooleanAttribute(name: string){
        this.nonBooleanAttributes_.push(name);
    }

    public RemoveNonBooleanAttribute(name: string){
        this.nonBooleanAttributes_ = this.nonBooleanAttributes_.filter(n => (n !== name));
    }
    
    public IsBooleanAttribute(name: string){
        if (this.nonBooleanAttributes_.includes(name)){
            return false;
        }

        if (this.booleanAttributes_.includes(name)){
            return true;
        }

        return null;
    }

    public OnElementScopeCreated({ scope }: IElementScopeCreatedCallbackParams){
        scope.AddAttributeChangeCallback((attrName) => {
            if (!attrName){
                return;
            }

            let callbackName = `${ToCamelCase(attrName, true, '-')}Changed`;// E.g 'SizeChanged'
            if (callbackName in this && typeof this[callbackName] === 'function'){
                this[callbackName]();
            }
            else if (KeyExists(attrName, this.state_)){
                this.AttributeChanged_(attrName);
            }
        });
    }

    protected AttributeChanged_(name: string){
        let [key, value] = (SetValue(this.state_, name, this.Cast_(name, (this.getAttribute(name) || '')), false) || []);
        if (key){//State updated
            if (IsObject(value)){
                Object.entries(value).forEach(([key, value]) => (this.shadow_ && this.shadow_.setAttribute(key, ToString(value))));
            }
            else{
                (this.shadow_ && this.shadow_.setAttribute(key, ToString(value)));
            }

            (this.ShouldRefreshOnChange_(key) && this.Refresh_());//Refresh if possible
        }
    }

    protected ShouldRefreshOnChange_(name: string){
        return true;
    }

    protected Refresh_(){}

    protected Cast_(name: string, value: any){
        if (!this.state_.hasOwnProperty(name)){
            return value;
        }
        
        return ((typeof this.state_[name] === 'boolean') ? this.hasAttribute(name) : ValueCast(this.state_[name], value));
    }
}
