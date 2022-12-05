"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const get_keys_1 = require("../utilities/get-keys");
const key_exists_1 = require("../utilities/key-exists");
const set_value_1 = require("../utilities/set-value");
class CustomElement extends HTMLElement {
    constructor(state, shadow_) {
        var _a;
        super();
        this.shadow_ = shadow_;
        this.state_ = {};
        state && (this.state_ = Object.assign(Object.assign({}, this.state_), state));
        if (!CustomElement.IsWatchingChange_()) {
            let dataDirective = (0, inlinejs_1.GetGlobal)().GetConfig().GetDirectiveName('data', false);
            let altDataDirective = (0, inlinejs_1.GetGlobal)().GetConfig().GetDirectiveName('data', true);
            let farthestAncestor = null;
            for (let ancestor = this; ancestor; ancestor = ancestor.parentNode) { //Find root component element
                if ((ancestor instanceof Element) && (ancestor.hasAttribute(dataDirective) || ancestor.hasAttribute(altDataDirective))) {
                    farthestAncestor = ancestor;
                }
            }
            let component = (0, inlinejs_1.GetGlobal)().CreateComponent(farthestAncestor || this), componentId = component.GetId();
            (_a = component.CreateElementScope(this)) === null || _a === void 0 ? void 0 : _a.AddUninitCallback(() => { var _a; return (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.RemoveAttributeChangeCallback(this); });
            component.AddAttributeChangeCallback(this, attributes => CustomElement.OnChange_(attributes));
        }
        let keys = (0, get_keys_1.GetKeys)(this.state_);
        Array.from(this.attributes).filter(attr => keys.includes(attr.name)).forEach((attr) => {
            let [key, value] = ((0, set_value_1.SetValue)(this.state_, attr.name, this.Cast_(attr.name, attr.value)) || []);
            if (key && (0, inlinejs_1.IsObject)(value)) {
                Object.entries(value).forEach(([key, value]) => (this.shadow_ && this.shadow_.setAttribute(key, (0, inlinejs_1.ToString)(value))));
            }
            else if (key) {
                (this.shadow_ && this.shadow_.setAttribute(key, (0, inlinejs_1.ToString)(value)));
            }
        });
    }
    AttributeChanged_(name) {
        let [key, value] = ((0, set_value_1.SetValue)(this.state_, name, this.Cast_(name, (this.getAttribute(name) || ''))) || []);
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
        return ((this.state_.hasOwnProperty(name) && typeof this.state_[name] === 'boolean') ? this.hasAttribute(name) : value);
    }
    static OnChange_(attributes) {
        attributes.forEach((attr) => {
            let formattedName = attr.name.split('-').reduce((prev, cur) => (prev + (cur.at(0) || '').toUpperCase() + (cur.substring(1) || '')), '');
            if (typeof attr.target[`${formattedName}Changed`] === 'function') { // E.g 'SizeChanged'
                attr.target[`${formattedName}Changed`]();
            }
            else if ((0, key_exists_1.KeyExists)(attr.name, attr.target.state_)) {
                attr.target.AttributeChanged_(attr.name);
            }
        });
    }
    static IsWatchingChange_(update = true) {
        let state = !!(globalThis['InlineJS'] = (globalThis['InlineJS'] || {}))['customElementWatchState'];
        update && (globalThis['InlineJS']['customElementWatchState'] = true);
        return state;
    }
}
exports.CustomElement = CustomElement;
