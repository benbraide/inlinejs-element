import { FindComponentById, GetGlobal, IsObject, ToCamelCase, ToString } from "@benbraide/inlinejs";
import { KeyExists } from "../utilities/key-exists";
import { GetKeys } from "../utilities/get-keys";
import { SetValue } from "../utilities/set-value";
export class CustomElement extends HTMLElement {
    constructor(state, shadow_, initializeBooleanAttributes = true, disableImplicitData = false, isTemplate_ = false) {
        super();
        this.shadow_ = shadow_;
        this.isTemplate_ = isTemplate_;
        this.componentId_ = '';
        this.state_ = {
            'component': '',
        };
        this.booleanAttributes_ = new Array();
        this.nonBooleanAttributes_ = new Array();
        state && Object.entries(state).forEach(([key, value]) => (this.state_[key] = value));
        initializeBooleanAttributes && this.InitializeBooleanAttributesFromState_();
        this.isTemplate_ && (this.style.display = 'none');
        if (!disableImplicitData && (!('InlineJS' in globalThis) || !IsObject(globalThis['InlineJS']) || !globalThis['InlineJS']['disableImplicitData'])) {
            const dataDirective = GetGlobal().GetConfig().GetDirectiveName('data', false);
            const altDataDirective = GetGlobal().GetConfig().GetDirectiveName('data', true);
            let farthestAncestor = null;
            for (let ancestor = this; ancestor; ancestor = ancestor.parentNode) {
                if ((ancestor instanceof Element) && (ancestor.hasAttribute(dataDirective) || ancestor.hasAttribute(altDataDirective))) {
                    farthestAncestor = ancestor;
                    break;
                }
            }
            !farthestAncestor && this.setAttribute('x-data', '');
        }
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
        return this.isTemplate_;
    }
    OnElementScopeCreated({ scope, component, componentId }) {
        var _a, _b;
        this.componentId_ = componentId;
        this.InitializeStateFromAttributes_();
        scope.AddAttributeChangeCallback((attrName) => {
            if (!attrName) {
                return;
            }
            let callbackName = `${ToCamelCase(attrName, true, '-')}Changed`; // E.g 'SizeChanged'
            if (callbackName in this && typeof this[callbackName] === 'function') {
                this[callbackName]();
            }
            else if (KeyExists(attrName, this.state_)) {
                this.AttributeChanged_(attrName);
            }
        });
        this.state_['component'] && ((_b = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.FindScopeByRoot(this)) === null || _b === void 0 ? void 0 : _b.SetName(this.state_['component']));
    }
    InitializeBooleanAttributesFromState_(except) {
        this.AddBooleanAttribute(Object.entries(this.state_).filter(([key, value]) => (typeof value === 'boolean' && (!except || !except.includes(key)))).map(([key, value]) => key));
    }
    InitializeStateFromAttributes_(whitelist) {
        const keys = GetKeys(this.state_);
        Array.from(this.attributes).filter(attr => (keys.includes(attr.name) && (!whitelist || whitelist.includes(attr.name)))).forEach((attr) => {
            let [key, value] = (SetValue(this.state_, attr.name, this.Cast_(attr.name, attr.value), true) || []);
            if (key && IsObject(value)) {
                Object.entries(value).forEach(([key, value]) => (this.shadow_ && this.shadow_.setAttribute(key, ToString(value))));
            }
            else if (key) {
                (this.shadow_ && this.shadow_.setAttribute(key, ToString(value)));
            }
        });
    }
    AttributeChanged_(name) {
        var _a, _b;
        let [key, value] = (SetValue(this.state_, name, this.Cast_(name, (this.getAttribute(name) || '')), true) || []);
        if (key) { //State updated
            if (this.shadow_ && IsObject(value)) {
                Object.entries(value).forEach(([key, value]) => this.shadow_.setAttribute(key, ToString(value)));
            }
            else if (this.shadow_) {
                this.shadow_.setAttribute(key, ToString(value));
            }
            (key === 'component') && ((_b = (_a = FindComponentById(this.componentId_)) === null || _a === void 0 ? void 0 : _a.FindScopeByRoot(this)) === null || _b === void 0 ? void 0 : _b.SetName(ToString(value)));
            (this.ShouldRefreshOnChange_(key) && this.Refresh_()); //Refresh if possible
        }
    }
    ShouldRefreshOnChange_(name) {
        return true;
    }
    Refresh_() { }
    Cast_(name, value) {
        if (!this.state_.hasOwnProperty(name)) {
            return value;
        }
        return ((this.state_.hasOwnProperty(name) && typeof this.state_[name] === 'boolean') ? this.hasAttribute(name) : value);
    }
}
