export function FindAncestor<T = any>(target: Element, prop: string): T | null {
    let ancestor = target.parentNode;
    while (ancestor && !(prop in ancestor)){// Find ancestor with prop
        ancestor = ancestor.parentNode;// Move up the tree
    }

    return (ancestor as T | null);
}
