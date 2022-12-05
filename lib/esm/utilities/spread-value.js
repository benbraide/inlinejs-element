import { AssignTarget } from "./assign";
import { GetLeafs } from "./get-leafs";
import { ValueCast } from "./value-cast";
export function SpreadValue(target, items, cast = true) {
    GetLeafs(target).forEach((leaf, index) => {
        let [computedTarget, name] = AssignTarget(target, leaf);
        computedTarget[name] = (cast ? ValueCast(computedTarget[name], items[index % items.length]) : items[index % items.length]);
    });
}
