import { IsObject } from "@benbraide/inlinejs";
function ExtractLeafs(target, node, leafs) {
    Object.entries(target).forEach(([key, value]) => {
        let leaf = (node ? `${node}.${key}` : key);
        if (IsObject(value)) {
            ExtractLeafs(value, leaf, leafs);
        }
        else {
            leafs.push(leaf);
        }
    });
}
export function GetLeafs(target) {
    let leafs = new Array();
    IsObject(target) && ExtractLeafs(target, '', leafs);
    return leafs;
}
