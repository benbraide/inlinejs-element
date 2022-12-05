import { FindComponentById, GetGlobal, IMutationObserverAttributeInfo, IsObject, ToString } from "@benbraide/inlinejs";
import { GetKeys } from "../utilities/get-keys";
import { KeyExists } from "../utilities/key-exists";
import { SetValue } from "../utilities/set-value";

export class CustomElement<ShadowType = Element> extends HTMLElement{
    protected state_: Record<string, any> = {};
    
    public constructor(state?: Record<string, any>, allowWatch = false, protected shadow_?: ShadowType){
        super();
        
        state && (this.state_ = { ...this.state_, ...state });
        if (allowWatch && !CustomElement.IsWatchingChange_()){
            let dataDirective = GetGlobal().GetConfig().GetDirectiveName('data', false);
            let altDataDirective = GetGlobal().GetConfig().GetDirectiveName('data', true);

            let farthestAncestor: Node | null = null;
            for (let ancestor: Node | null = this; ancestor; ancestor = ancestor.parentNode){//Find root component element
                if ((ancestor instanceof Element) && (ancestor.hasAttribute(dataDirective) || ancestor.hasAttribute(altDataDirective))){
                    farthestAncestor = ancestor;
                }
            }

            let component = GetGlobal().CreateComponent((farthestAncestor as HTMLElement) || this), componentId = component.GetId();

            component.CreateElementScope(this)?.AddUninitCallback(() => FindComponentById(componentId)?.RemoveAttributeChangeCallback(this));
            component.AddAttributeChangeCallback(this, attributes => CustomElement.OnChange_(attributes));
        }

        let keys = GetKeys(this.state_);
        Array.from(this.attributes).filter(attr => keys.includes(attr.name)).forEach((attr) => {//Initialize state from attributes
            let [key, value] = (SetValue(this.state_, attr.name, this.Cast_(attr.name, attr.value)) || []);
            if (key && IsObject(value)){
                Object.entries(value).forEach(([key, value]) => (this.shadow_ && (this.shadow_ as unknown as Element).setAttribute(key, ToString(value))));
            }
            else if (key){
                (this.shadow_ && (this.shadow_ as unknown as Element).setAttribute(key, ToString(value)));
            }
        });
    }

    protected AttributeChanged_(name: string){
        let [key, value] = (SetValue(this.state_, name, this.Cast_(name, (this.getAttribute(name) || ''))) || []);
        if (key){//State updated
            if (IsObject(value)){
                Object.entries(value).forEach(([key, value]) => (this.shadow_ && (this.shadow_ as unknown as Element).setAttribute(key, ToString(value))));
            }
            else{
                (this.shadow_ && (this.shadow_ as unknown as Element).setAttribute(key, ToString(value)));
            }

            (this.ShouldRefreshOnChange_(key) && this.Refresh_());//Refresh if possible
        }
    }

    protected ShouldRefreshOnChange_(name: string){
        return true;
    }

    protected Refresh_(){}

    protected Cast_(name: string, value: any){
        return ((this.state_.hasOwnProperty(name) && typeof this.state_[name] === 'boolean') ? this.hasAttribute(name) : value);
    }

    protected static OnChange_(attributes: Array<IMutationObserverAttributeInfo>){
        attributes.forEach((attr) => {
            let formattedName = attr.name.split('-').reduce((prev, cur) => (prev + (cur.at(0) || '').toUpperCase() + (cur.substring(1) || '')), '');
            if (typeof attr.target[`${formattedName}Changed`] === 'function'){// E.g 'SizeChanged'
                attr.target[`${formattedName}Changed`]();
            }
            else if (KeyExists(attr.name, (attr.target as unknown as CustomElement).state_)){
                (attr.target as unknown as CustomElement).AttributeChanged_(attr.name);
            }
        });
    }

    protected static IsWatchingChange_(update = true){
        let state = !!(globalThis['InlineJS'] = (globalThis['InlineJS'] || {}))['customElementWatchState'];
        update && (globalThis['InlineJS']['customElementWatchState'] = true);
        return state;
    }
}
