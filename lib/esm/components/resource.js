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
export class ResourceElement extends CustomElement {
    constructor() {
        super({
            isTemplate: true,
            isHidden: true,
        });
        this.src = '';
        this.type = '';
    }
    GetResource() {
        if (this.type === 'link' || this.type === 'script' || this.type === 'data') {
            return {
                type: this.type,
                path: this.src,
            };
        }
        return this.src;
    }
    HandlePostAttributesProcessPostfix_() {
        var _a;
        (_a = FindAncestor(this, ancestor => ('AddResource' in ancestor))) === null || _a === void 0 ? void 0 : _a.AddResource(this);
    }
    ShouldLoadResources_() {
        return false;
    }
}
__decorate([
    Property({ type: 'string' })
], ResourceElement.prototype, "src", void 0);
__decorate([
    Property({ type: 'string' })
], ResourceElement.prototype, "type", void 0);
export function ResourceElementCompact() {
    RegisterCustomElement(ResourceElement, 'resource');
}
