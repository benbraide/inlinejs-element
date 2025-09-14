var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { BootstrapAndAttach, EvaluateLater, FindAncestor, FindComponentById, GetConfig, GetGlobal, InferComponent, IsCustomElement, JournalTry, ProcessDirectives, RetrieveStoredObject, StoreProxyHandler, ToSnakeCase, ToString } from "@benbraide/inlinejs";
import { GetProperties, GetPropertyScope, Property } from "../decorators/property";
export class CustomElement extends HTMLElement {
    constructor(options_ = {}) {
        super();
        this.options_ = options_;
        this.componentId_ = '';
        this.storedProxyAccessHandler_ = null;
        this.resources_ = new Array();
        this.loadedResources_ = null;
        this.loadingResources_ = false;
        this.queuedResourceHandlers_ = new Array();
        this.nativeElement_ = null;
        this.nativeElements_ = new Array();
        this.nativeAttributesBlacklist_ = new Array();
        this.nativeAttributesWhitelist_ = new Array();
        this.propertyScopes_ = new Array();
        this.instanceProperties_ = new Array();
        this.instancePropertyNames_ = new Array();
        this.attributeChangeHandlers_ = {};
        this.spreads_ = {};
        this.storedObjects_ = {};
        this.booleanAttributes_ = new Array();
        this.nonBooleanAttributes_ = new Array();
        (this.options_.isTemplate || this.options_.isHidden) && (this.style.display = 'none');
    }
    UpdateComponentProperty(value) {
        var _a;
        const component = FindComponentById(this.componentId_);
        if (component) {
            value = (value || '').trim();
            (_a = component.FindScopeByRoot(this)) === null || _a === void 0 ? void 0 : _a.SetName(value);
            component.GetRoot() === this && component.SetName(value);
        }
    }
    connectedCallback() {
        // Use requestAnimationFrame to ensure proper timing after DOM insertion
        requestAnimationFrame(() => {
            this.InitializeIfNeeded_();
        });
    }
    InitializeIfNeeded_() {
        if (this.componentId_)
            return; // Already initialized
        if (InferComponent(this))
            return; // Contained inside a mounted element
        const config = GetConfig();
        const dataDirectives = [config.GetDirectiveName('data', false), config.GetDirectiveName('data', true)];
        const found = FindAncestor(this, (el) => {
            if (IsCustomElement(el))
                return true; // Contained inside another custom element
            if (dataDirectives.some(directive => el.hasAttribute(directive)))
                return true; // Contained inside element with a "hx-data" directive
            return false;
        });
        if (!found) { // Not contained - add "hx-data" directive
            this.setAttribute(dataDirectives[0], '');
            BootstrapAndAttach(this);
        }
    }
    AddResource(resource) {
        this.resources_.push(resource);
    }
    RemoveResource(resource) {
        this.resources_ = this.resources_.filter(r => (r !== resource));
    }
    LoadResources() {
        if (this.loadingResources_) {
            return new Promise((resolve, reject) => {
                this.queuedResourceHandlers_.push(() => {
                    this.loadedResources_ ? resolve(this.loadedResources_) : reject();
                });
            });
        }
        if (this.loadedResources_) {
            return Promise.resolve(this.loadedResources_);
        }
        this.loadingResources_ = true;
        return new Promise((resolve, reject) => {
            const promises = new Array(), resources = new Array(), doResolve = (data) => {
                this.loadingResources_ = false;
                this.loadedResources_ = data;
                this.queuedResourceHandlers_.forEach(handler => handler());
                this.queuedResourceHandlers_ = [];
                resolve(data);
            };
            this.resources_.forEach((resource) => {
                if (typeof resource === 'string') {
                    resources.push(resource);
                }
                else if ('LoadTargetResources' in resource) {
                    promises.push(resource.LoadTargetResources());
                }
                else if ('GetResource' in resource) {
                    resources.push(resource.GetResource());
                }
                else {
                    resources.push(resource);
                }
            });
            if (resources.length > 0) { //Load resources
                const resourceConcept = GetGlobal().GetConcept('resource');
                if (resourceConcept) {
                    const promise = resourceConcept.Get({
                        items: resources,
                        attributes: this.GetResourceLoadAttributes_(),
                        concurrent: this.IsConcurrentResourceLoad_(),
                    });
                    promises.push(promise);
                }
            }
            if (promises.length == 0) { //No resources
                doResolve([]);
            }
            else { //Wait for resources
                Promise.all(promises).then(doResolve).catch(reject);
            }
        });
    }
    AddNativeElement(element) {
        this.nativeElements_.push(element);
        this.CopyNativeElements_(element);
    }
    RemoveNativeElement(element) {
        this.nativeElements_ = this.nativeElements_.filter(e => (e !== element));
    }
    AddBooleanAttribute(name) {
        Array.isArray(name) ? this.booleanAttributes_.push(...name) : this.booleanAttributes_.push(name);
    }
    RemoveBooleanAttribute(name) {
        this.booleanAttributes_ = (Array.isArray(name) ? this.booleanAttributes_.filter(n => !name.includes(n)) : this.booleanAttributes_.filter(n => (n !== name)));
    }
    AddNonBooleanAttribute(name) {
        Array.isArray(name) ? this.nonBooleanAttributes_.push(...name) : this.nonBooleanAttributes_.push(name);
    }
    RemoveNonBooleanAttribute(name) {
        this.nonBooleanAttributes_ = (Array.isArray(name) ? this.nonBooleanAttributes_.filter(n => !name.includes(n)) : this.nonBooleanAttributes_.filter(n => (n !== name)));
    }
    IsBooleanAttribute(name) {
        if (this.nonBooleanAttributes_.includes(name)) {
            return false;
        }
        if (this.booleanAttributes_.includes(name)) {
            return true;
        }
        return null;
    }
    IsTemplate() {
        return this.options_.isTemplate || false;
    }
    OnElementScopeCreated(params) {
        this.HandleElementScopeCreated_(params);
    }
    OnElementScopeMarked(scope) {
        this.HandleElementScopeMarked_(scope);
    }
    OnElementScopeDestroyed(scope) {
        this.HandleElementScopeDestroyed_(scope);
    }
    EvaluateExpression(expression, options) {
        return this.EvaluateWithStoredProxyAccessHandler(EvaluateLater({
            componentId: this.componentId_,
            contextElement: this,
            expression,
            disableFunctionCall: options === null || options === void 0 ? void 0 : options.disableFunctionCall,
            waitPromise: options === null || options === void 0 ? void 0 : options.waitPromise,
            voidOnly: options === null || options === void 0 ? void 0 : options.voidOnly,
        }), options === null || options === void 0 ? void 0 : options.callback, options === null || options === void 0 ? void 0 : options.params, options === null || options === void 0 ? void 0 : options.contexts);
    }
    EvaluateWithStoredProxyAccessHandler(fn, callback, params, contexts) {
        if (!this.storedProxyAccessHandler_) {
            return fn(callback, params, contexts);
        }
        let data;
        this.storedProxyAccessHandler_(() => (data = fn(callback, params, contexts)));
        return data;
    }
    AddPropertyScope_(name) {
        this.propertyScopes_.push(GetPropertyScope(CustomElement, name));
    }
    FindProperty_(name) {
        return this.instanceProperties_.find(prop => (prop.name === name));
    }
    GetAllProperties_() {
        let props = new Array(), properties = GetProperties();
        for (let scope of this.propertyScopes_) {
            if (properties.hasOwnProperty(scope)) {
                props.push(...Object.values(properties[scope]));
            }
        }
        return props;
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        this.HandleElementScopeCreatedPrefix_(Object.assign({ scope }, rest));
        scope.AddPostAttributesProcessCallback(() => {
            this.HandlePostAttributesProcess_();
            postAttributesCallback === null || postAttributesCallback === void 0 ? void 0 : postAttributesCallback();
        });
        scope.AddPostProcessCallback(() => this.HandlePostProcess_());
        scope.AddAttributeChangeCallback(name => (name && this.AttributeChanged_(name)));
        this.HandleElementScopeCreatedPostfix_(Object.assign({ scope }, rest));
    }
    HandleElementScopeCreatedPrefix_({ componentId }) {
        this.componentId_ = componentId;
        this.propertyScopes_ = this.ComputePropertyScopes_();
        this.storedProxyAccessHandler_ = StoreProxyHandler(componentId);
        (this.instanceProperties_ = this.GetAllProperties_()).forEach((property) => {
            (property.type === 'boolean') && this.booleanAttributes_.push(property.name);
            const spread = (property.spread && ToSnakeCase(property.spread));
            if (spread && this.spreads_.hasOwnProperty(spread)) {
                this.spreads_[spread].push(property.name);
            }
            else if (spread) {
                this.spreads_[spread] = [property.name];
            }
        });
        this.instancePropertyNames_ = this.instanceProperties_.map(p => p.name);
    }
    HandleElementScopeCreatedPostfix_(params) { }
    HandleElementScopeMarked_(scope) { }
    HandleElementScopeDestroyed_(scope) {
        this.nativeElement_ = null;
        this.storedProxyAccessHandler_ = null;
    }
    HandlePostProcess_() {
        this.ShouldLoadResources_() && this.LoadResources();
    }
    HandlePostAttributesProcess_() {
        this.HandlePostAttributesProcessPrefix_();
        this.instanceProperties_.forEach((property) => {
            if (property.initial !== undefined && property.setInitial && !this.hasAttribute(property.name)) {
                property.setInitial(this.EncodeValue_(property.initial, property.type), this);
            }
        });
        this.InitializeStateFromAttributes_();
        this.HandlePostAttributesProcessPostfix_();
    }
    HandlePostAttributesProcessPrefix_() { }
    HandlePostAttributesProcessPostfix_() { }
    InitializeStateFromAttributes_(whitelist) {
        let attributes = Array.from(this.attributes);
        whitelist && (attributes = attributes.filter(({ name }) => whitelist.includes(name)));
        attributes.forEach(({ name }) => this.AttributeChanged_(name));
    }
    EncodeValue_(value, type) {
        if (type === 'boolean') {
            return (value ? 'true' : 'false');
        }
        if (type === 'json') {
            return JSON.stringify(value);
        }
        if (type === 'array') {
            return (value || []).join(',');
        }
        if (type.startsWith('array:')) {
            return (value || []).map((v) => this.EncodeValue_(v, type.substring(6))).join(',');
        }
        if (type === 'date') {
            return (value || new Date()).toString();
        }
        return ToString(value);
    }
    DecodeValue_(value, type, delimiter) {
        if (value === 'null' || value === 'undefined') {
            return this.DecodeNullish_(type, value === 'null' ? null : undefined);
        }
        if (type === 'string') {
            return (value || '');
        }
        if (type === 'boolean') {
            return (value !== null && value !== undefined && value !== '0' && value !== 'false');
        }
        if (type === 'number') {
            return ((value === null) ? NaN : (parseFloat(value || '0') || 0));
        }
        if (type === 'json') {
            try {
                return JSON.parse(value || '');
            }
            catch (_a) { }
            return null;
        }
        if (type === 'array') {
            return ((value || '').split(delimiter || ',').map(s => s.trim()) || []);
        }
        if (type.startsWith('array:')) {
            return ((value || '').split(delimiter || ',').map(s => this.DecodeValue_(s, type.substring(6), delimiter)) || []);
        }
        if (type === 'date') {
            return new Date(value || '');
        }
        return value;
    }
    DecodeNullish_(type, nullValue = null) {
        if (type === 'string') {
            return '';
        }
        if (type === 'boolean') {
            return false;
        }
        if (type === 'number') {
            return NaN;
        }
        return nullValue;
    }
    SpreadValue_(value, keys) {
        let parts = value.split(' ');
        keys.forEach((key, index) => {
            if (index >= parts.length) {
                let resolvedIndex = ((index % 4) - 2);
                this.DispatchAttributeChange_(key, ((resolvedIndex < 0 || resolvedIndex >= parts.length) ? parts[0] : parts[resolvedIndex]));
            }
            else {
                this.DispatchAttributeChange_(key, parts[index]);
            }
        });
    }
    DispatchAttributeChange_(name, value) {
        let handled = false;
        if (this.spreads_.hasOwnProperty(name)) {
            this.SpreadValue_((value || ''), this.spreads_[name]);
            handled = true;
        }
        const property = this.FindProperty_(name), storedKey = (this.storedObjects_.hasOwnProperty(name) && this.storedObjects_[name]);
        if (property) {
            let callHandler = null;
            if (property.checkStoredObject && value) {
                if (value === storedKey) { //Duplicate
                    return;
                }
                const result = RetrieveStoredObject({
                    key: value,
                    componentId: this.componentId_,
                    contextElement: this,
                });
                if (result !== value) {
                    this.storedObjects_[name] = value;
                    (callHandler = (handler) => JournalTry(() => handler(result, this)));
                }
            }
            if (callHandler) {
                callHandler(property.handler);
            }
            else {
                JournalTry(() => property.handler(this.DecodeValue_(value, (property.type || 'string'), property.delimiter), this));
            }
            handled = true;
        }
        return handled;
    }
    AttributeChanged_(name) {
        let targetName = '';
        if (this.nativeElement_) {
            if (name.startsWith('data-native-')) {
                targetName = name.substring(12);
            }
            else if (name.startsWith('native-')) {
                targetName = name.substring(7);
            }
            else if (name.startsWith('-')) {
                targetName = name.substring(1);
            }
        }
        if (targetName) { //Pass to native element
            if (this.hasAttribute(name)) {
                this.nativeElement_.setAttribute(targetName, (this.getAttribute(name) || ''));
            }
            else if (this.nativeElement_.hasAttribute(targetName)) {
                this.nativeElement_.removeAttribute(targetName);
            }
        }
        else { //Handle attribute change
            const handled = this.DispatchAttributeChange_(name, this.getAttribute(name));
            if (!handled && (this.nativeAttributesWhitelist_.includes(name) || !this.nativeAttributesBlacklist_.includes(name)) &&
                this.nativeElement_ && !name.startsWith('data-') && !CustomElement.GlobalAttributes.includes(name)) {
                if (this.hasAttribute(name)) {
                    this.nativeElement_.setAttribute(name, (this.getAttribute(name) || ''));
                }
                else if (this.nativeElement_.hasAttribute(name)) {
                    this.nativeElement_.removeAttribute(name);
                }
            }
        }
    }
    ComputePropertyScopes_() {
        let hierarchy = new Array();
        for (let prototype = Object.getPrototypeOf(this); prototype && prototype !== HTMLElement.prototype; prototype = Object.getPrototypeOf(prototype)) {
            hierarchy.push(prototype.constructor.name);
        }
        return hierarchy;
    }
    SetNativeElement_(element) {
        if (element !== this.nativeElement_) {
            this.nativeElement_ = element;
            this.CopyNativeElements_();
        }
    }
    CopyNativeElements_(element) {
        if (!this.nativeElement_ || this.nativeElements_.length == 0) {
            return;
        }
        (element ? [element] : this.nativeElements_).forEach((element) => {
            element.GetAttributes().forEach(({ name, value }) => this.nativeElement_.setAttribute(name, value));
            for (let child = element.firstChild; child; child = element.firstChild) {
                child.remove();
                this.nativeElement_.appendChild(child);
            }
        });
        ProcessDirectives({
            component: this.componentId_,
            element: this.nativeElement_,
        });
    }
    GetResourceLoadAttributes_() {
        return undefined;
    }
    IsConcurrentResourceLoad_() {
        return true;
    }
    ShouldLoadResources_() {
        return true;
    }
}
CustomElement.GlobalAttributes = ['id', 'class', 'style', 'title', 'lang', 'dir', 'tabindex', 'accesskey', 'hidden', 'draggable', 'spellcheck', 'translate', 'contenteditable'];
__decorate([
    Property({ type: 'string' })
], CustomElement.prototype, "UpdateComponentProperty", null);
