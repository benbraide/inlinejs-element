"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueCast = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
function ValueCast(target, value) {
    let stringValue = (0, inlinejs_1.ToString)(value);
    if (typeof target === 'boolean') {
        return (stringValue === 'true');
    }
    if (typeof target === 'number') {
        return (parseFloat(stringValue) || 0);
    }
    if (Array.isArray(target)) {
        try {
            let value = JSON.parse(stringValue);
            return (Array.isArray(value) ? value : []);
        }
        catch (_a) { }
        return stringValue.split(',');
    }
    if ((0, inlinejs_1.IsObject)(target)) {
        try {
            return JSON.parse(stringValue);
        }
        catch (_b) { }
        return {};
    }
    return ((typeof target === 'string') ? stringValue : value);
}
exports.ValueCast = ValueCast;
