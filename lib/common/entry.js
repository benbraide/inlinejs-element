"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJSElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const native_1 = require("./components/native");
const resource_1 = require("./components/resource");
const resource_target_1 = require("./components/resource-target");
function InlineJSElement() {
    (0, inlinejs_1.WaitForGlobal)().then(() => {
        (0, native_1.NativeElementCompact)();
        (0, resource_1.ResourceElementCompact)();
        (0, resource_target_1.ResourceTargetElementCompact)();
    });
}
exports.InlineJSElement = InlineJSElement;
