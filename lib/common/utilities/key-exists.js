"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyExists = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
function KeyExists(key, target) {
    if (!key || !(0, inlinejs_1.IsObject)(target)) {
        return false;
    }
    if (target.hasOwnProperty(key)) {
        return true;
    }
    return (Object.values(target).findIndex(val => KeyExists(key, val)) != -1);
}
exports.KeyExists = KeyExists;
