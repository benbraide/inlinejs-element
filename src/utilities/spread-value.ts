import { AssignTarget } from "./assign";
import { GetLeafs } from "./get-leafs";
import { ValueCast } from "./value-cast";

export function SpreadValue(target: Record<string, any>, items: Array<any>, cast = true){
    GetLeafs(target).forEach((leaf, index) => {
        let [computedTarget, name] = AssignTarget(target, leaf);
        computedTarget[name] = (cast ? ValueCast(computedTarget[name], items[index % items.length]) : items[index % items.length]);
    });
}
