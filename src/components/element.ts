import { FindComponentById, GetGlobal, IElementScopeCreatedCallbackParams, IsObject, ToCamelCase, ToString } from "@benbraide/inlinejs";
import { KeyExists } from "../utilities/key-exists";
import { GetKeys } from "../utilities/get-keys";
import { SetValue } from "../utilities/set-value";

export class CustomElement<ShadowType extends Element = Element> extends HTMLElement{
    protected componentId_ = '';
    
    protected state_: Record<string, any> = {
        'component': '',
    };

    protected booleanAttributes_ = new Array<string>();
    protected nonBooleanAttributes_ = new Array<string>();
    
    public constructor(state?: Record<string, any>, protected shadow_?: ShadowType, initializeBooleanAttributes = true, disableImplicitData = false, protected isTemplate_ = false){
        super();

        state && Object.entries(state).forEach(([key, value]) => (this.state_[key] = value));
        initializeBooleanAttributes && this.InitializeBooleanAttributesFromState_();
        this.isTemplate_ && (this.style.display = 'none');

        if (!disableImplicitData && (!('InlineJS' in globalThis) || !IsObject(globalThis['InlineJS']) || !globalThis['InlineJS']['disableImplicitData'])){
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

    public AddBooleanAttribute(name: string | Array<string>){
        Array.isArray(name) ? this.booleanAttributes_.push(...name) : this.booleanAttributes_.push(name);
    }

    public RemoveBooleanAttribute(name: string | Array<string>){
        this.booleanAttributes_ = (Array.isArray(name) ? this.booleanAttributes_.filter(n => !name.includes(n)) : this.booleanAttributes_.filter(n => (n !== name)));
    }

    public AddNonBooleanAttribute(name: string | Array<string>){
        Array.isArray(name) ? this.nonBooleanAttributes_.push(...name) : this.nonBooleanAttributes_.push(name);
    }

    public RemoveNonBooleanAttribute(name: string | Array<string>){
        this.nonBooleanAttributes_ = (Array.isArray(name) ? this.nonBooleanAttributes_.filter(n => !name.includes(n)) : this.nonBooleanAttributes_.filter(n => (n !== name)));
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

    public IsTemplate(){
        return this.isTemplate_;
    }

    public OnElementScopeCreated({ scope, component, componentId }: IElementScopeCreatedCallbackParams){
        this.componentId_ = componentId;
        this.InitializeStateFromAttributes_();
        
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

        this.state_['component'] && (component || FindComponentById(componentId))?.FindScopeByRoot(this)?.SetName(this.state_['component']);
    }

    protected InitializeBooleanAttributesFromState_(except?: Array<string>){
        this.AddBooleanAttribute(Object.entries(this.state_).filter(([key, value]) => (typeof value === 'boolean' && (!except || !except.includes(key)))).map(([key, value]) => key));
    }

    protected InitializeStateFromAttributes_(whitelist?: Array<string>){
        const keys = GetKeys(this.state_);
        Array.from(this.attributes).filter(attr => (keys.includes(attr.name) && (!whitelist || whitelist.includes(attr.name)))).forEach((attr) => {
            let [key, value] = (SetValue(this.state_, attr.name, this.Cast_(attr.name, attr.value), true) || []);
            if (key && IsObject(value)){
                Object.entries(value).forEach(([key, value]) => (this.shadow_ && this.shadow_.setAttribute(key, ToString(value))));
            }
            else if (key){
                (this.shadow_ && this.shadow_.setAttribute(key, ToString(value)));
            }
        });
    }

    protected AttributeChanged_(name: string){
        let [key, value] = (SetValue(this.state_, name, this.Cast_(name, (this.getAttribute(name) || '')), true) || []);
        if (key){//State updated
            if (this.shadow_ && IsObject(value)){
                Object.entries(value).forEach(([key, value]) => this.shadow_!.setAttribute(key, ToString(value)));
            }
            else if (this.shadow_){
                this.shadow_.setAttribute(key, ToString(value));
            }

            (key === 'component') && FindComponentById(this.componentId_)?.FindScopeByRoot(this)?.SetName(ToString(value));

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
        
        return ((this.state_.hasOwnProperty(name) && typeof this.state_[name] === 'boolean') ? this.hasAttribute(name) : value);
    }
}
