"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
function Register(name) {
    return function (target) {
        let resolvedName = (0, inlinejs_1.ToSnakeCase)(name || target.name);
        resolvedName = (resolvedName && (0, inlinejs_1.GetGlobal)().GetConfig().GetElementName(resolvedName));
        resolvedName && !customElements.get(resolvedName) && customElements.define(resolvedName, target);
    };
}
exports.Register = Register;
