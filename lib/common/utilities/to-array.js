"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToArray = void 0;
function ToArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === 'string') {
        return value.split(' ');
    }
    return [value];
}
exports.ToArray = ToArray;
