import {
    FindComponentById,
    GetGlobal,
    IElementScopeCreatedCallbackParams,
    IResourceConcept,
    IResourceMixedItemInfo,
    IsObject,
    JournalTry,
    ProcessDirectives,
    RetrieveStoredObject,
    ToSnakeCase,
    ToString
} from "@benbraide/inlinejs";

import { GetProperties, GetPropertyScope, IProperty, Property } from "../decorators/property";
import { INativeElement, IResourceTarget, CustomElementResourceType } from "../types";

export interface ICustomElementOptions{
    disableImplicitData?: boolean;
    isTemplate?: boolean;
    isHidden?: boolean;
}

export type ICustomElementAttributeChangeHandlerCallback = (value: any, context: HTMLElement) => void;

export interface ICustomElementAttributeChangeHandlerInfo{
    handler: ICustomElementAttributeChangeHandlerCallback;
    type?: string;
    checkStoredObject?: boolean;
}

export class CustomElement extends HTMLElement implements IResourceTarget{
    protected componentId_ = '';

    protected resources_ = new Array<CustomElementResourceType>();
    protected loadedResources_: any = null;

    protected loadingResources_ = false;
    protected queuedResourceHandlers_ = new Array<() => void>();

    protected nativeElement_: HTMLElement | null = null;
    protected nativeElements_ = new Array<INativeElement & HTMLElement>();

    protected nativeAttributesBlacklist_ = new Array<string>();
    protected nativeAttributesWhitelist_ = new Array<string>();

    protected propertyScopes_ = new Array<string>();
    protected instanceProperties_ = new Array<IProperty>();
    protected instancePropertyNames_ = new Array<string>();

    protected attributeChangeHandlers_: Record<string, Array<ICustomElementAttributeChangeHandlerInfo>> = {};
    protected spreads_: Record<string, Array<string>> = {};
    protected storedObjects_: Record<string, string> = {};

    protected booleanAttributes_ = new Array<string>();
    protected nonBooleanAttributes_ = new Array<string>();

    @Property({ type: 'string' })
    public UpdateComponentProperty(value: string){
        FindComponentById(this.componentId_)?.FindScopeByRoot(this)?.SetName(value.trim());
    }
    
    public constructor(protected options_: ICustomElementOptions = {}){
        super();
        
        (this.options_.isTemplate || this.options_.isHidden) && (this.style.display = 'none');

        if (!this.options_.disableImplicitData && (!('InlineJS' in globalThis) || !IsObject(globalThis['InlineJS']) || !globalThis['InlineJS']['disableImplicitData'])){
            const dataDirective = GetGlobal().GetConfig().GetDirectiveName('data', false);
            const altDataDirective = GetGlobal().GetConfig().GetDirectiveName('data', true);
            
            let farthestAncestor: Node | null = null;
            for (let ancestor: Node | null = this; ancestor; ancestor = ancestor.parentNode){
                if ((ancestor instanceof Element) && (ancestor.hasAttribute(dataDirective) || ancestor.hasAttribute(altDataDirective))){
                    farthestAncestor = ancestor;
                    break;
                }
            }

            !farthestAncestor && this.setAttribute(dataDirective, '');
        }
    }

    public AddResource(resource: CustomElementResourceType){
        this.resources_.push(resource);
    }

    public RemoveResource(resource: CustomElementResourceType){
        this.resources_ = this.resources_.filter(r => (r !== resource));
    }

    public LoadResources(){
        if (this.loadingResources_){
            return new Promise((resolve, reject) => {
                this.queuedResourceHandlers_.push(() => {
                    this.loadedResources_ ? resolve(this.loadedResources_) : reject();
                });
            });
        }

        if (this.loadedResources_){
            return Promise.resolve(this.loadedResources_);
        }
        
        this.loadingResources_ = true;
        return new Promise((resolve, reject) => {
            const promises = new Array<Promise<any>>(), resources = new Array<string | IResourceMixedItemInfo>(), doResolve = (data: any) => {
                this.loadingResources_ = false;
                this.loadedResources_ = data;
                this.queuedResourceHandlers_.forEach(handler => handler());
                this.queuedResourceHandlers_ = [];
                resolve(data);
            };

            this.resources_.forEach((resource) => {
                if (typeof resource === 'string'){
                    resources.push(resource);
                }
                else if ('LoadResources' in resource){
                    promises.push(resource.LoadResources());
                }
                else if ('GetResource' in resource){
                    resources.push(resource.GetResource());
                }
                else{
                    resources.push(resource);
                }
            });

            if (resources.length > 0){//Load resources
                const resourceConcept = GetGlobal().GetConcept<IResourceConcept>('resource');
                if (resourceConcept){
                    const promise = resourceConcept.Get({
                        items: resources,
                        attributes: this.GetResourceLoadAttributes_(),
                        concurrent: this.IsConcurrentResourceLoad_(),
                    });
                    promises.push(promise);
                }
            }

            if (promises.length == 0){//No resources
                doResolve([]);
            }
            else{//Wait for resources
                Promise.all(promises).then(doResolve).catch(reject);
            }
        });
    }

    public AddNativeElement(element: INativeElement & HTMLElement){
        this.nativeElements_.push(element);
        this.CopyNativeElements_(element);
    }

    public RemoveNativeElement(element: INativeElement){
        this.nativeElements_ = this.nativeElements_.filter(e => (e !== element));
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
        return this.options_.isTemplate;
    }

    public OnElementScopeCreated(params: IElementScopeCreatedCallbackParams){
        this.HandleElementScopeCreated_(params);
    }

    protected AddPropertyScope_(name: string){
        this.propertyScopes_.push(GetPropertyScope(CustomElement, name));
    }

    protected FindProperty_(name: string){
        return this.instanceProperties_.find(prop => (prop.name === name));
    }

    protected GetAllProperties_(){
        let props = new Array<IProperty>(), properties = GetProperties();
        for (let scope of this.propertyScopes_){
            if (properties.hasOwnProperty(scope)){
                props.push(...Object.values(properties[scope]));
            }
        }
        return props;
    }

    protected HandleElementScopeCreated_({ scope, componentId }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        this.componentId_ = componentId;
        this.propertyScopes_ = this.ComputePropertyScopes_();
        
        (this.instanceProperties_ = this.GetAllProperties_()).forEach((property) => {
            (property.type === 'boolean') && this.booleanAttributes_.push(property.name);
            
            const spread = (property.spread && ToSnakeCase(property.spread));
            if (spread && this.spreads_.hasOwnProperty(spread)){
                this.spreads_[spread].push(property.name);
            }
            else if (spread){
                this.spreads_[spread] = [property.name];
            }
        });

        this.instancePropertyNames_ = this.instanceProperties_.map(p => p.name);

        scope.AddPostAttributesProcessCallback(() => {
            this.instanceProperties_.forEach((property) => {
                property.initial && property.setInitial && property.setInitial(this.EncodeValue_(property.initial, property.type), this);
            });
            this.InitializeStateFromAttributes_();
            postAttributesCallback && postAttributesCallback();
        });

        scope.AddPostProcessCallback(() => (this.ShouldLoadResources_() && this.LoadResources()));

        scope.AddAttributeChangeCallback(name => (name && this.AttributeChanged_(name)));

        scope.AddUninitCallback(() => (this.nativeElement_ = null));
    }

    protected InitializeStateFromAttributes_(whitelist?: Array<string>){
        let attributes = Array.from(this.attributes);
        whitelist && (attributes = attributes.filter(({ name }) => whitelist.includes(name)));
        attributes.forEach(({ name }) => this.AttributeChanged_(name));
    }

    protected EncodeValue_(value: any, type: string){
        if (type === 'boolean'){
            return (value ? 'true' : 'false');
        }

        if (type === 'json'){
            return JSON.stringify(value);
        }

        if (type === 'array'){
            return (value || []).join(',');
        }

        if (type.startsWith('array:')){
            return (value || []).map((v: any) => this.EncodeValue_(v, type.substring(6))).join(',');
        }

        if (type === 'date'){
            return (value || new Date()).toString();
        }

        return ToString(value);
    }
    
    protected DecodeValue_(value: string | null, type: string, delimiter?: string){
        if (type === 'string'){
            return (value || '');
        }
        
        if (type === 'boolean'){
            return (value !== null && value !== undefined && value !== '0' && value !== 'false');
        }

        if (type === 'number'){
            return ((value === null) ? NaN : (parseFloat(value || '0') || 0));
        }

        if (type === 'json'){
            try{
                return JSON.parse(value || '');
            }
            catch{}
            return null;
        }

        if (type === 'array'){
            return ((value || '').split(delimiter || ',').map(s => s.trim()) || []);
        }

        if (type.startsWith('array:')){
            return ((value || '').split(delimiter || ',').map(s => this.DecodeValue_(s, type.substring(6), delimiter)) || []);
        }

        if (type === 'date'){
            return new Date(value || '');
        }
        
        return value;
    }

    protected SpreadValue_(value: string, keys: Array<string>){
        let parts = value.split(' ');
        keys.forEach((key, index) => {
            if (index >= parts.length){
                let resolvedIndex = ((index % 4) - 2);
                this.DispatchAttributeChange_(key, ((resolvedIndex < 0 || resolvedIndex >= parts.length) ? parts[0] : parts[resolvedIndex]));
            }
            else{
                this.DispatchAttributeChange_(key, parts[index]);
            }
        });
    }

    protected DispatchAttributeChange_(name: string, value: string | null){
        let handled = false;
        if (this.spreads_.hasOwnProperty(name)){
            this.SpreadValue_((value || ''), this.spreads_[name]);
            handled = true;
        }
        
        const property = this.FindProperty_(name), storedKey = (this.storedObjects_.hasOwnProperty(name) && this.storedObjects_[name]);
        if (property){
            let callHandler: ((handler: ICustomElementAttributeChangeHandlerCallback) => void) | null = null;
            if (property.checkStoredObject && value){
                if (value === storedKey){//Duplicate
                    return;
                }
                
                const result = RetrieveStoredObject({
                    key: value,
                    componentId: this.componentId_,
                    contextElement: this,
                });

                if (result !== value){
                    this.storedObjects_[name] = value;
                    (callHandler = (handler) => JournalTry(() => handler(result, this)));
                }
            }

            if (callHandler){
                callHandler(property.handler);
            }
            else{
                JournalTry(() => property.handler(this.DecodeValue_(value, (property.type || 'string'), property.delimiter), this));
            }

            handled = true;
        }

        return handled;
    }
    
    protected AttributeChanged_(name: string){
        let targetName = '';
        if (this.nativeElement_){
            if (name.startsWith('data-native-')){
                targetName = name.substring(12);
            }
            else if (name.startsWith('native-')){
                targetName = name.substring(7);
            }
            else if (name.startsWith('-')){
                targetName = name.substring(1);
            }
        }
        
        if (targetName){//Pass to native element
            if (this.hasAttribute(name)){
                this.nativeElement_!.setAttribute(targetName, (this.getAttribute(name) || ''));
            }
            else if (this.nativeElement_!.hasAttribute(targetName)){
                this.nativeElement_!.removeAttribute(targetName);
            }
        }
        else{//Handle attribute change
            const handled = this.DispatchAttributeChange_(name, this.getAttribute(name));
            if (!handled && (this.nativeAttributesWhitelist_.includes(name) || !this.nativeAttributesBlacklist_.includes(name)) &&
                this.nativeElement_ && !name.startsWith('data-') && !CustomElement.GlobalAttributes.includes(name)){
                if (this.hasAttribute(name)){
                    this.nativeElement_.setAttribute(name, (this.getAttribute(name) || ''));
                }
                else if (this.nativeElement_.hasAttribute(name)){
                    this.nativeElement_.removeAttribute(name);
                }
            }
        }
    }

    protected ComputePropertyScopes_(){
        let hierarchy = new Array<string>();
        for (let prototype = Object.getPrototypeOf(this); prototype && prototype !== HTMLElement.prototype; prototype = Object.getPrototypeOf(prototype)){
            hierarchy.push(prototype.constructor.name);
        }
        return hierarchy;
    }

    protected SetNativeElement_(element: HTMLElement | null){
        if (element !== this.nativeElement_){
            this.nativeElement_ = element;
            this.CopyNativeElements_();
        }
    }

    protected CopyNativeElements_(element?: INativeElement & HTMLElement){
        if (!this.nativeElement_ || this.nativeElements_.length == 0){
            return;
        }
        
        (element ? [element] : this.nativeElements_).forEach((element) => {
            element.GetAttributes().forEach(({ name, value }) => this.nativeElement_!.setAttribute(name, value));
            for (let child = element.firstChild; child; child = element.firstChild){
                child.remove();
                this.nativeElement_!.appendChild(child);
            }
        });

        ProcessDirectives({
            component: this.componentId_,
            element: this.nativeElement_,
        });
    }

    protected GetResourceLoadAttributes_(): Record<string, string> | undefined{
        return undefined;
    }
    
    protected IsConcurrentResourceLoad_(){
        return true;
    }

    protected ShouldLoadResources_(){
        return true;
    }

    public static GlobalAttributes = ['id', 'class', 'style', 'title', 'lang', 'dir', 'tabindex', 'accesskey', 'hidden', 'draggable', 'spellcheck', 'translate', 'contenteditable'];
}
