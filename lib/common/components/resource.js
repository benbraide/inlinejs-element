"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceElementCompact = exports.ResourceElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const property_1 = require("../decorators/property");
const element_1 = require("./element");
const register_1 = require("../utilities/register");
class ResourceElement extends element_1.CustomElement {
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
        (_a = (0, inlinejs_1.FindAncestor)(this, ancestor => ('AddResource' in ancestor))) === null || _a === void 0 ? void 0 : _a.AddResource(this);
    }
    ShouldLoadResources_() {
        return false;
    }
}
__decorate([
    (0, property_1.Property)({ type: 'string' })
], ResourceElement.prototype, "src", void 0);
__decorate([
    (0, property_1.Property)({ type: 'string' })
], ResourceElement.prototype, "type", void 0);
exports.ResourceElement = ResourceElement;
function ResourceElementCompact() {
    (0, register_1.RegisterCustomElement)(ResourceElement, 'resource');
}
exports.ResourceElementCompact = ResourceElementCompact;
