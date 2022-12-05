"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetValue = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const spread_value_1 = require("./spread-value");
const to_array_1 = require("./to-array");
const value_cast_1 = require("./value-cast");
function SetValue(target, key, value, cast = true) {
    if (target.hasOwnProperty(key)) {
        if ((0, inlinejs_1.IsObject)(target[key])) {
            (0, spread_value_1.SpreadValue)(target[key], (0, to_array_1.ToArray)(value), cast);
            return [key, target[key]];
        }
        return [key, (target[key] = (cast ? (0, value_cast_1.ValueCast)(target[key], value) : value))];
    }
    for (let ownKey of Object.keys(target)) {
        if ((0, inlinejs_1.IsObject)(target[ownKey])) {
            let result = SetValue(target[ownKey], key, value);
            if (result) {
                return result;
            }
        }
    }
    return null;
}
exports.SetValue = SetValue;
