"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeElementCompact = exports.NativeElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const element_1 = require("./element");
const register_1 = require("../utilities/register");
class NativeElement extends element_1.CustomElement {
    constructor() {
        super();
        this.attributes_ = new Array();
        Array.from(this.attributes).forEach(({ name, value }) => this.attributes_.push({ name, value }));
        this.options_.isTemplate = true;
        this.options_.isHidden = true;
    }
    GetAttributes() {
        return this.attributes_;
    }
    HandleElementScopeCreated_(params, postAttributesCallback) {
        var _a;
        (_a = (0, inlinejs_1.FindAncestor)(this, ancestor => ('AddNativeElement' in ancestor))) === null || _a === void 0 ? void 0 : _a.AddNativeElement(this);
        super.HandleElementScopeCreated_(params, postAttributesCallback);
    }
}
exports.NativeElement = NativeElement;
function NativeElementCompact() {
    (0, register_1.RegisterCustomElement)(NativeElement);
}
exports.NativeElementCompact = NativeElementCompact;
