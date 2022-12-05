"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpreadValue = void 0;
const assign_1 = require("./assign");
const get_leafs_1 = require("./get-leafs");
const value_cast_1 = require("./value-cast");
function SpreadValue(target, items, cast = true) {
    (0, get_leafs_1.GetLeafs)(target).forEach((leaf, index) => {
        let [computedTarget, name] = (0, assign_1.AssignTarget)(target, leaf);
        computedTarget[name] = (cast ? (0, value_cast_1.ValueCast)(computedTarget[name], items[index % items.length]) : items[index % items.length]);
    });
}
exports.SpreadValue = SpreadValue;
