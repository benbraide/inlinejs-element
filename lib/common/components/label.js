"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLabelElement = void 0;
const wrapper_1 = require("./wrapper");
class CustomLabelElement extends HTMLLabelElement {
    constructor(state, shadow_) {
        super();
        this.shadow_ = shadow_;
        this.state_ = {};
        this.wrapper_ = new wrapper_1.CustomElementWrapper(this, this.state_, state, shadow_);
        this.wrapper_.SetCallbacks({
            AttributeChanged: (name) => this.AttributeChanged_(name),
            ShouldRefreshOnChange: (name) => this.ShouldRefreshOnChange_(name),
            Refresh: () => this.Refresh_(),
            Cast: (name, value) => this.Cast_(name, value),
        });
    }
    IsBooleanAttribute(name) {
        return this.wrapper_.IsBooleanAttribute(name);
    }
    OnElementScopeCreated(params) {
        this.wrapper_.OnElementScopeCreated(params);
    }
    AttributeChanged_(name) {
        this.wrapper_.AttributeChanged(name, true);
    }
    ShouldRefreshOnChange_(name) {
        return this.wrapper_.ShouldRefreshOnChange(name, true);
    }
    Refresh_() { }
    Cast_(name, value) {
        return this.wrapper_.Cast(name, value, true);
    }
}
exports.CustomLabelElement = CustomLabelElement;
