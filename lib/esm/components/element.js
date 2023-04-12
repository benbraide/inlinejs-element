import { GetGlobal, IsObject, ToCamelCase, ToString } from "@benbraide/inlinejs";
import { KeyExists } from "../utilities/key-exists";
import { GetKeys } from "../utilities/get-keys";
import { SetValue } from "../utilities/set-value";
import { ValueCast } from "../utilities/value-cast";
export class CustomElement extends HTMLElement {
    constructor(state, shadow_) {
        super();
        this.shadow_ = shadow_;
        this.state_ = {};
        this.booleanAttributes_ = new Array();
        this.nonBooleanAttributes_ = new Array();
        state && Object.entries(state).forEach(([key, value]) => (this.state_[key] = value));
        const keys = GetKeys(this.state_);
        Array.from(this.attributes).filter(attr => keys.includes(attr.name)).forEach((attr) => {
            let [key, value] = (SetValue(this.state_, attr.name, this.Cast_(attr.name, attr.value), false) || []);
            if (key && IsObject(value)) {
                Object.entries(value).forEach(([key, value]) => (this.shadow_ && this.shadow_.setAttribute(key, ToString(value))));
            }
            else if (key) {
                (this.shadow_ && this.shadow_.setAttribute(key, ToString(value)));
            }
        });
        if (!('InlineJS' in globalThis) || !IsObject(globalThis['InlineJS']) || !globalThis['InlineJS']['disableImplicitData']) {
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
        this.booleanAttributes_.push(name);
    }
    RemoveBooleanAttribute(name) {
        this.booleanAttributes_ = this.booleanAttributes_.filter(n => (n !== name));
    }
    AddNonBooleanAttribute(name) {
        this.nonBooleanAttributes_.push(name);
    }
    RemoveNonBooleanAttribute(name) {
        this.nonBooleanAttributes_ = this.nonBooleanAttributes_.filter(n => (n !== name));
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
    OnElementScopeCreated({ scope }) {
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
    }
    AttributeChanged_(name) {
        let [key, value] = (SetValue(this.state_, name, this.Cast_(name, (this.getAttribute(name) || '')), false) || []);
        if (key) { //State updated
            if (IsObject(value)) {
                Object.entries(value).forEach(([key, value]) => (this.shadow_ && this.shadow_.setAttribute(key, ToString(value))));
            }
            else {
                (this.shadow_ && this.shadow_.setAttribute(key, ToString(value)));
            }
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
        return ((typeof this.state_[name] === 'boolean') ? this.hasAttribute(name) : ValueCast(this.state_[name], value));
    }
}
