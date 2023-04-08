import { IsObject, ToCamelCase, ToString } from "@benbraide/inlinejs";
import { GetKeys } from "../utilities/get-keys";
import { KeyExists } from "../utilities/key-exists";
import { SetValue } from "../utilities/set-value";
export class CustomElementWrapper {
    constructor(el_, state_, state, shadow_) {
        this.el_ = el_;
        this.state_ = state_;
        this.shadow_ = shadow_;
        this.callbacks_ = null;
        this.booleanAttributes_ = new Array();
        this.nonBooleanAttributes_ = new Array();
        state && Object.entries(state).forEach(([key, value]) => (this.state_[key] = value));
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
            var _a;
            if (!attrName) {
                return;
            }
            let callbackName = `${ToCamelCase(attrName, true, '-')}Changed`; // E.g 'SizeChanged'
            if (callbackName in this.el_ && typeof this.el_[callbackName] === 'function') {
                this.el_[callbackName]();
            }
            else if (KeyExists(attrName, this.state_)) {
                (_a = this.callbacks_) === null || _a === void 0 ? void 0 : _a.AttributeChanged(attrName);
            }
        });
    }
    SetCallbacks(callbacks) {
        let keys = GetKeys(this.state_);
        this.callbacks_ = callbacks;
        Array.from(this.el_.attributes).filter(attr => keys.includes(attr.name)).forEach((attr) => {
            let [key, value] = (SetValue(this.state_, attr.name, this.Cast(attr.name, attr.value)) || []);
            if (key && IsObject(value)) {
                Object.entries(value).forEach(([key, value]) => (this.shadow_ && this.shadow_.setAttribute(key, ToString(value))));
            }
            else if (key) {
                (this.shadow_ && this.shadow_.setAttribute(key, ToString(value)));
            }
        });
    }
    AttributeChanged(name, external = false) {
        var _a;
        if (!external) {
            (_a = this.callbacks_) === null || _a === void 0 ? void 0 : _a.AttributeChanged(name);
            return;
        }
        let [key, value] = (SetValue(this.state_, name, this.Cast(name, (this.el_.getAttribute(name) || ''))) || []);
        if (key) { //State updated
            if (IsObject(value)) {
                Object.entries(value).forEach(([key, value]) => (this.shadow_ && this.shadow_.setAttribute(key, ToString(value))));
            }
            else {
                (this.shadow_ && this.shadow_.setAttribute(key, ToString(value)));
            }
            (this.ShouldRefreshOnChange(key) && this.Refresh()); //Refresh if possible
        }
    }
    ShouldRefreshOnChange(name, external = false) {
        var _a;
        return (external ? true : (((_a = this.callbacks_) === null || _a === void 0 ? void 0 : _a.ShouldRefreshOnChange(name)) || false));
    }
    Refresh(external = false) {
        var _a;
        !external && ((_a = this.callbacks_) === null || _a === void 0 ? void 0 : _a.Refresh());
    }
    Cast(name, value, external = false) {
        var _a;
        if (!external) {
            return (_a = this.callbacks_) === null || _a === void 0 ? void 0 : _a.Cast(name, value);
        }
        return ((this.state_.hasOwnProperty(name) && typeof this.state_[name] === 'boolean') ? this.el_.hasAttribute(name) : value);
    }
    static OnChange_(attributes) {
        attributes.forEach((attr) => {
            let formattedName = attr.name.split('-').reduce((prev, cur) => (prev + (cur.at(0) || '').toUpperCase() + (cur.substring(1) || '')), '');
            if (typeof attr.target[`${formattedName}Changed`] === 'function') { // E.g 'SizeChanged'
                attr.target[`${formattedName}Changed`]();
            }
            else if (KeyExists(attr.name, attr.target.state_)) {
                attr.target.AttributeChanged_(attr.name);
            }
        });
    }
}
