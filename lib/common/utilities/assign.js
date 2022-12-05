"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assign = exports.AssignTarget = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
function AssignTarget(target, path) {
    let parts = path.split('.');
    if (parts.length <= 1) {
        return [target, path];
    }
    return [parts.slice(0, (parts.length - 1)).reduce((prev, cur) => {
            return ((0, inlinejs_1.IsObject)(prev[cur]) ? prev[cur] : (prev[cur] = {}));
        }, target), (parts.at(-1) || '')];
}
exports.AssignTarget = AssignTarget;
function Assign(target, path, value) {
    let [computedTarget, name] = AssignTarget(target, path);
    return (computedTarget[name] = value);
}
exports.Assign = Assign;
