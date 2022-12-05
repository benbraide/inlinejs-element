"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetKeys = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
function AddKeys(target, keys) {
    Object.entries(target).forEach(([key, value]) => {
        keys.push(key);
        (0, inlinejs_1.IsObject)(value) && AddKeys(value, keys);
    });
}
function GetKeys(target) {
    let keys = new Array();
    (0, inlinejs_1.IsObject)(target) && AddKeys(target, keys);
    return keys;
}
exports.GetKeys = GetKeys;
