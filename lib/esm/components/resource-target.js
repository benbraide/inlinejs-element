var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { FindAncestor } from "@benbraide/inlinejs";
import { Property } from "../decorators/property";
import { CustomElement } from "./element";
import { RegisterCustomElement } from "../utilities/register";
export class ResourceTargetElement extends CustomElement {
    constructor() {
        super({
            isHidden: true,
        });
        this.attributes_ = null;
        this.sequential = false;
        this.defer = false;
    }
    UpdateAttributesProperty(value) {
        this.attributes_ = value;
    }
    HandleElementScopeCreated_(params, postAttributesCallback) {
        super.HandleElementScopeCreated_(params, () => {
            var _a;
            (_a = FindAncestor(this, ancestor => ('AddResource' in ancestor))) === null || _a === void 0 ? void 0 : _a.AddResource(this);
            postAttributesCallback && postAttributesCallback();
        });
    }
    GetResourceLoadAttributes_() {
        return (this.attributes_ || undefined);
    }
    IsConcurrentResourceLoad_() {
        return !this.sequential;
    }
    ShouldLoadResources_() {
        return !this.defer;
    }
}
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], ResourceTargetElement.prototype, "UpdateAttributesProperty", null);
__decorate([
    Property({ type: 'boolean' })
], ResourceTargetElement.prototype, "sequential", void 0);
__decorate([
    Property({ type: 'boolean' })
], ResourceTargetElement.prototype, "defer", void 0);
export function ResourceTargetElementCompact() {
    RegisterCustomElement(ResourceTargetElement, 'resource-target');
}
