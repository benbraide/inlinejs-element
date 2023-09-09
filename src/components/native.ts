import { FindAncestor, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";

import { INativeElement, INativeElementAttribute } from "../types";
import { CustomElement } from "./element";
import { RegisterCustomElement } from "../utilities/register";

export class NativeElement extends CustomElement implements INativeElement{
    protected attributes_ = new Array<INativeElementAttribute>();

    public constructor(){
        super();

        Array.from(this.attributes).forEach(({ name, value }) => {
            this.attributes_.push({ name, value });
            this.removeAttribute(name);
        });

        this.options_.isTemplate = true;
        this.options_.isHidden = true;

        this.style.display = 'none';
    }
    
    public GetAttributes(){
        return this.attributes_;
    }

    protected HandleElementScopeCreated_(params: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        FindAncestor<any>(this, ancestor => ('AddNativeElement' in ancestor))?.AddNativeElement(this);
        super.HandleElementScopeCreated_(params, postAttributesCallback);
    }
}

export function NativeElementCompact(){
    RegisterCustomElement(NativeElement);
}
