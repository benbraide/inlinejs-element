import { FindAncestor } from "@benbraide/inlinejs";
import { CustomElement } from "./element";
import { RegisterCustomElement } from "../utilities/register";
export class NativeElement extends CustomElement {
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
        (_a = FindAncestor(this, ancestor => ('AddNativeElement' in ancestor))) === null || _a === void 0 ? void 0 : _a.AddNativeElement(this);
        super.HandleElementScopeCreated_(params, postAttributesCallback);
    }
}
export function NativeElementCompact() {
    RegisterCustomElement(NativeElement);
}
