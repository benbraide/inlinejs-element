"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLeafs = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
function ExtractLeafs(target, node, leafs) {
    Object.entries(target).forEach(([key, value]) => {
        let leaf = (node ? `${node}.${key}` : key);
        if ((0, inlinejs_1.IsObject)(value)) {
            ExtractLeafs(value, leaf, leafs);
        }
        else {
            leafs.push(leaf);
        }
    });
}
function GetLeafs(target) {
    let leafs = new Array();
    (0, inlinejs_1.IsObject)(target) && ExtractLeafs(target, '', leafs);
    return leafs;
}
exports.GetLeafs = GetLeafs;
