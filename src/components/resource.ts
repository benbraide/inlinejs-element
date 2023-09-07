import { FindAncestor, IElementScopeCreatedCallbackParams, IResourceMixedItemInfo } from "@benbraide/inlinejs";

import { Property } from "../decorators/property";
import { CustomElement } from "./element";
import { IResourceSource, IResourceTarget } from "../types";
import { RegisterCustomElement } from "../utilities/register";

export class ResourceElement extends CustomElement implements IResourceSource{
    @Property({ type: 'string' })
    public src = '';

    @Property({ type: 'string' })
    public type: string = '';

    public constructor(){
        super({
            isTemplate: true,
            isHidden: true,
        });
    }

    public GetResource(){
        if (this.type === 'link' || this.type === 'script' || this.type === 'data'){
            return <IResourceMixedItemInfo>{
                type: this.type,
                path: this.src,
            };
        }

        return this.src;
    }

    protected HandleElementScopeCreated_(params: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_(params, () => {
            FindAncestor<IResourceTarget>(this, ancestor => ('AddResource' in ancestor))?.AddResource(this);
            postAttributesCallback && postAttributesCallback();
        });
    }

    protected ShouldLoadResources_(){
        return false;
    }
}

export function ResourceElementCompact(){
    RegisterCustomElement(ResourceElement, 'resource');
}
