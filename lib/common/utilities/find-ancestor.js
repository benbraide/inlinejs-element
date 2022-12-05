"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAncestor = void 0;
function FindAncestor(target, prop) {
    let ancestor = target.parentNode;
    while (ancestor && !(prop in ancestor)) { // Find ancestor with prop
        ancestor = ancestor.parentNode; // Move up the tree
    }
    return ancestor;
}
exports.FindAncestor = FindAncestor;
