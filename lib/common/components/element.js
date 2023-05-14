"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const key_exists_1 = require("../utilities/key-exists");
const get_keys_1 = require("../utilities/get-keys");
const set_value_1 = require("../utilities/set-value");
class CustomElement extends HTMLElement {
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
        if (!disableImplicitData && (!('InlineJS' in globalThis) || !(0, inlinejs_1.IsObject)(globalThis['InlineJS']) || !globalThis['InlineJS']['disableImplicitData'])) {
            const dataDirective = (0, inlinejs_1.GetGlobal)().GetConfig().GetDirectiveName('data', false);
            const altDataDirective = (0, inlinejs_1.GetGlobal)().GetConfig().GetDirectiveName('data', true);
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
            let callbackName = `${(0, inlinejs_1.ToCamelCase)(attrName, true, '-')}Changed`; // E.g 'SizeChanged'
            if (callbackName in this && typeof this[callbackName] === 'function') {
                this[callbackName]();
            }
            else if ((0, key_exists_1.KeyExists)(attrName, this.state_)) {
                this.AttributeChanged_(attrName);
            }
        });
        this.state_['component'] && ((_b = (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.FindScopeByRoot(this)) === null || _b === void 0 ? void 0 : _b.SetName(this.state_['component']));
    }
    InitializeBooleanAttributesFromState_(except) {
        this.AddBooleanAttribute(Object.entries(this.state_).filter(([key, value]) => (typeof value === 'boolean' && (!except || !except.includes(key)))).map(([key, value]) => key));
    }
    InitializeStateFromAttributes_(whitelist) {
        const keys = (0, get_keys_1.GetKeys)(this.state_);
        Array.from(this.attributes).filter(attr => (keys.includes(attr.name) && (!whitelist || whitelist.includes(attr.name)))).forEach((attr) => {
            let [key, value] = ((0, set_value_1.SetValue)(this.state_, attr.name, this.Cast_(attr.name, attr.value), true) || []);
            if (key && (0, inlinejs_1.IsObject)(value)) {
                Object.entries(value).forEach(([key, value]) => (this.shadow_ && this.shadow_.setAttribute(key, (0, inlinejs_1.ToString)(value))));
            }
            else if (key) {
                (this.shadow_ && this.shadow_.setAttribute(key, (0, inlinejs_1.ToString)(value)));
            }
        });
    }
    AttributeChanged_(name) {
        var _a, _b;
        let [key, value] = ((0, set_value_1.SetValue)(this.state_, name, this.Cast_(name, (this.getAttribute(name) || '')), true) || []);
        if (key) { //State updated
            if (this.shadow_ && (0, inlinejs_1.IsObject)(value)) {
                Object.entries(value).forEach(([key, value]) => this.shadow_.setAttribute(key, (0, inlinejs_1.ToString)(value)));
            }
            else if (this.shadow_) {
                this.shadow_.setAttribute(key, (0, inlinejs_1.ToString)(value));
            }
            (key === 'component') && ((_b = (_a = (0, inlinejs_1.FindComponentById)(this.componentId_)) === null || _a === void 0 ? void 0 : _a.FindScopeByRoot(this)) === null || _b === void 0 ? void 0 : _b.SetName((0, inlinejs_1.ToString)(value)));
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
exports.CustomElement = CustomElement;
