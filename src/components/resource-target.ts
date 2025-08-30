import { FindAncestor, JournalTry } from "@benbraide/inlinejs";

import { Property } from "../decorators/property";
import { CustomElement } from "./element";
import { RegisterCustomElement } from "../utilities/register";
import { IResourceTarget, IResourceTargetAdvanced } from "../types";

export class ResourceTargetElement extends CustomElement implements IResourceTargetAdvanced{
    protected attributes_: Record<string, string> | null = null;
    
    @Property({ type: 'object', checkStoredObject: true })
    public UpdateAttributesProperty(value: Record<string, string> | null){
        this.attributes_ = value;
    }

    @Property({ type: 'boolean' })
    public sequential = false;

    @Property({ type: 'boolean' })
    public defer = false;

    @Property({ type: 'string' })
    public onloaded = '';

    @Property({ type: 'string' })
    public onloadederror = '';

    public constructor(){
        super({
            isHidden: true,
        });
    }

    public LoadResources(){
        const wasLoaded = this.loadedResources_;
        return new Promise((resolve, reject) => {
            super.LoadResources().then((data) => {
                !wasLoaded && this.onloaded && JournalTry(() => this.EvaluateExpression(this.onloaded, {
                    disableFunctionCall: false,
                    contexts: { data },
                }));
                resolve(data);
            }).catch((reason) => {
                this.onloadederror && JournalTry(() => this.EvaluateExpression(this.onloadederror, {
                    disableFunctionCall: false,
                    contexts: { reason },
                }));
                reject(reason);
            });
        });
    }

    public LoadTargetResources(){
        return this.LoadResources();
    }

    protected HandlePostAttributesProcessPostfix_(){
        FindAncestor<IResourceTarget>(this, ancestor => ('AddResource' in ancestor))?.AddResource(this);
    }

    protected GetResourceLoadAttributes_(): Record<string, string> | undefined{
        return (this.attributes_ || undefined);
    }
    
    protected IsConcurrentResourceLoad_(){
        return !this.sequential;
    }

    protected ShouldLoadResources_(){
        return !this.defer;
    }
}

export function ResourceTargetElementCompact(){
    RegisterCustomElement(ResourceTargetElement, 'resource-target');
}
