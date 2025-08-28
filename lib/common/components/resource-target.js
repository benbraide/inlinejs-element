"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceTargetElementCompact = exports.ResourceTargetElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const property_1 = require("../decorators/property");
const element_1 = require("./element");
const register_1 = require("../utilities/register");
class ResourceTargetElement extends element_1.CustomElement {
    constructor() {
        super({
            isHidden: true,
        });
        this.attributes_ = null;
        this.sequential = false;
        this.defer = false;
        this.onloaded = '';
        this.onloadederror = '';
    }
    UpdateAttributesProperty(value) {
        this.attributes_ = value;
    }
    LoadResources() {
        const wasLoaded = this.loadedResources_;
        return new Promise((resolve, reject) => {
            super.LoadResources().then((data) => {
                !wasLoaded && this.onloaded && (0, inlinejs_1.JournalTry)(() => this.EvaluateExpression(this.onloaded, {
                    disableFunctionCall: false,
                    contexts: { data },
                }));
                resolve(data);
            }).catch((reason) => {
                this.onloadederror && (0, inlinejs_1.JournalTry)(() => this.EvaluateExpression(this.onloadederror, {
                    disableFunctionCall: false,
                    contexts: { reason },
                }));
                reject(reason);
            });
        });
    }
    LoadTargetResources() {
        return this.LoadResources();
    }
    HandleElementScopeCreated_(params, postAttributesCallback) {
        super.HandleElementScopeCreated_(params, () => {
            var _a;
            (_a = (0, inlinejs_1.FindAncestor)(this, ancestor => ('AddResource' in ancestor))) === null || _a === void 0 ? void 0 : _a.AddResource(this);
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
    (0, property_1.Property)({ type: 'object', checkStoredObject: true })
], ResourceTargetElement.prototype, "UpdateAttributesProperty", null);
__decorate([
    (0, property_1.Property)({ type: 'boolean' })
], ResourceTargetElement.prototype, "sequential", void 0);
__decorate([
    (0, property_1.Property)({ type: 'boolean' })
], ResourceTargetElement.prototype, "defer", void 0);
__decorate([
    (0, property_1.Property)({ type: 'string' })
], ResourceTargetElement.prototype, "onloaded", void 0);
__decorate([
    (0, property_1.Property)({ type: 'string' })
], ResourceTargetElement.prototype, "onloadederror", void 0);
exports.ResourceTargetElement = ResourceTargetElement;
function ResourceTargetElementCompact() {
    (0, register_1.RegisterCustomElement)(ResourceTargetElement, 'resource-target');
}
exports.ResourceTargetElementCompact = ResourceTargetElementCompact;
