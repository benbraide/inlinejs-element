var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { FindComponentById, GetGlobal, IsObject, JournalTry, RetrieveStoredObject, ToSnakeCase, ToString } from "@benbraide/inlinejs";
import { GetProperties, GetPropertyScope, Property } from "../decorators/property";
export class CustomElement extends HTMLElement {
    constructor(options_ = {}) {
        super();
        this.options_ = options_;
        this.componentId_ = '';
        this.nativeElement_ = null;
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
        if (!this.options_.disableImplicitData && (!('InlineJS' in globalThis) || !IsObject(globalThis['InlineJS']) || !globalThis['InlineJS']['disableImplicitData'])) {
            const dataDirective = GetGlobal().GetConfig().GetDirectiveName('data', false);
            const altDataDirective = GetGlobal().GetConfig().GetDirectiveName('data', true);
            let farthestAncestor = null;
            for (let ancestor = this; ancestor; ancestor = ancestor.parentNode) {
                if ((ancestor instanceof Element) && (ancestor.hasAttribute(dataDirective) || ancestor.hasAttribute(altDataDirective))) {
                    farthestAncestor = ancestor;
                    break;
                }
            }
            !farthestAncestor && this.setAttribute(dataDirective, '');
        }
    }
    UpdateComponentProperty(value) {
        var _a, _b;
        (_b = (_a = FindComponentById(this.componentId_)) === null || _a === void 0 ? void 0 : _a.FindScopeByRoot(this)) === null || _b === void 0 ? void 0 : _b.SetName(value.trim());
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
        return this.options_.isTemplate;
    }
    OnElementScopeCreated(params) {
        this.HandleElementScopeCreated_(params);
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
    HandleElementScopeCreated_({ scope, componentId }, postAttributesCallback) {
        this.componentId_ = componentId;
        this.propertyScopes_ = this.ComputePropertyScopes_();
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
        scope.AddPostAttributesProcessCallback(() => {
            this.instanceProperties_.forEach((property) => {
                property.initial && property.setInitial && property.setInitial(this.EncodeValue_(property.initial, property.type), this);
            });
            this.InitializeStateFromAttributes_();
            postAttributesCallback && postAttributesCallback();
        });
        scope.AddAttributeChangeCallback(name => (name && this.AttributeChanged_(name)));
        scope.AddUninitCallback(() => (this.nativeElement_ = null));
    }
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
        if (this.nativeElement_ && name.startsWith('-')) { //Pass to native element
            const targetName = name.substring(1);
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
}
CustomElement.GlobalAttributes = ['id', 'class', 'style', 'title', 'lang', 'dir', 'tabindex', 'accesskey', 'hidden', 'draggable', 'spellcheck', 'translate', 'contenteditable'];
__decorate([
    Property({ type: 'string' })
], CustomElement.prototype, "UpdateComponentProperty", null);
