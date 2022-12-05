import { FindComponentById, GetGlobal, IsObject, ToString } from "@benbraide/inlinejs";
import { GetKeys } from "../utilities/get-keys";
import { KeyExists } from "../utilities/key-exists";
import { SetValue } from "../utilities/set-value";
export class CustomElement extends HTMLElement {
    constructor(state, allowWatch = false, shadow_) {
        var _a;
        super();
        this.shadow_ = shadow_;
        this.state_ = {};
        state && (this.state_ = Object.assign(Object.assign({}, this.state_), state));
        if (allowWatch && !CustomElement.IsWatchingChange_()) {
            let dataDirective = GetGlobal().GetConfig().GetDirectiveName('data', false);
            let altDataDirective = GetGlobal().GetConfig().GetDirectiveName('data', true);
            let farthestAncestor = null;
            for (let ancestor = this; ancestor; ancestor = ancestor.parentNode) { //Find root component element
                if ((ancestor instanceof Element) && (ancestor.hasAttribute(dataDirective) || ancestor.hasAttribute(altDataDirective))) {
                    farthestAncestor = ancestor;
                }
            }
            let component = GetGlobal().CreateComponent(farthestAncestor || this), componentId = component.GetId();
            (_a = component.CreateElementScope(this)) === null || _a === void 0 ? void 0 : _a.AddUninitCallback(() => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.RemoveAttributeChangeCallback(this); });
            component.AddAttributeChangeCallback(this, attributes => CustomElement.OnChange_(attributes));
        }
        let keys = GetKeys(this.state_);
        Array.from(this.attributes).filter(attr => keys.includes(attr.name)).forEach((attr) => {
            let [key, value] = (SetValue(this.state_, attr.name, this.Cast_(attr.name, attr.value)) || []);
            if (key && IsObject(value)) {
                Object.entries(value).forEach(([key, value]) => (this.shadow_ && this.shadow_.setAttribute(key, ToString(value))));
            }
            else if (key) {
                (this.shadow_ && this.shadow_.setAttribute(key, ToString(value)));
            }
        });
    }
    AttributeChanged_(name) {
        let [key, value] = (SetValue(this.state_, name, this.Cast_(name, (this.getAttribute(name) || ''))) || []);
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
        return ((this.state_.hasOwnProperty(name) && typeof this.state_[name] === 'boolean') ? this.hasAttribute(name) : value);
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
    static IsWatchingChange_(update = true) {
        let state = !!(globalThis['InlineJS'] = (globalThis['InlineJS'] || {}))['customElementWatchState'];
        update && (globalThis['InlineJS']['customElementWatchState'] = true);
        return state;
    }
}
