"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const key_exists_1 = require("../utilities/key-exists");
const get_keys_1 = require("../utilities/get-keys");
const set_value_1 = require("../utilities/set-value");
const value_cast_1 = require("../utilities/value-cast");
class CustomElement extends HTMLElement {
    constructor(state, shadow_) {
        super();
        this.shadow_ = shadow_;
        this.state_ = {};
        this.booleanAttributes_ = new Array();
        this.nonBooleanAttributes_ = new Array();
        state && Object.entries(state).forEach(([key, value]) => (this.state_[key] = value));
        const keys = (0, get_keys_1.GetKeys)(this.state_);
        Array.from(this.attributes).filter(attr => keys.includes(attr.name)).forEach((attr) => {
            let [key, value] = ((0, set_value_1.SetValue)(this.state_, attr.name, this.Cast_(attr.name, attr.value), false) || []);
            if (key && (0, inlinejs_1.IsObject)(value)) {
                Object.entries(value).forEach(([key, value]) => (this.shadow_ && this.shadow_.setAttribute(key, (0, inlinejs_1.ToString)(value))));
            }
            else if (key) {
                (this.shadow_ && this.shadow_.setAttribute(key, (0, inlinejs_1.ToString)(value)));
            }
        });
        if (!('InlineJS' in globalThis) || !(0, inlinejs_1.IsObject)(globalThis['InlineJS']) || !globalThis['InlineJS']['disableImplicitData']) {
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
            let callbackName = `${(0, inlinejs_1.ToCamelCase)(attrName, true, '-')}Changed`; // E.g 'SizeChanged'
            if (callbackName in this && typeof this[callbackName] === 'function') {
                this[callbackName]();
            }
            else if ((0, key_exists_1.KeyExists)(attrName, this.state_)) {
                this.AttributeChanged_(attrName);
            }
        });
    }
    AttributeChanged_(name) {
        let [key, value] = ((0, set_value_1.SetValue)(this.state_, name, this.Cast_(name, (this.getAttribute(name) || '')), false) || []);
        if (key) { //State updated
            if ((0, inlinejs_1.IsObject)(value)) {
                Object.entries(value).forEach(([key, value]) => (this.shadow_ && this.shadow_.setAttribute(key, (0, inlinejs_1.ToString)(value))));
            }
            else {
                (this.shadow_ && this.shadow_.setAttribute(key, (0, inlinejs_1.ToString)(value)));
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
        return ((typeof this.state_[name] === 'boolean') ? this.hasAttribute(name) : (0, value_cast_1.ValueCast)(this.state_[name], value));
    }
}
exports.CustomElement = CustomElement;
