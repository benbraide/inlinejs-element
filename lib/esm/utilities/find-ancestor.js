export function FindAncestor(target, prop) {
    let ancestor = target.parentNode;
    while (ancestor && !(prop in ancestor)) { // Find ancestor with prop
        ancestor = ancestor.parentNode; // Move up the tree
    }
    return ancestor;
}
