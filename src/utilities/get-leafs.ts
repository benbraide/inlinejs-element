import { IsObject } from "@benbraide/inlinejs";

function ExtractLeafs(target: Record<string, any>, node: string, leafs: Array<string>){
    Object.entries(target).forEach(([key, value]) => {
        let leaf = (node ? `${node}.${key}` : key);
        if (IsObject(value)){
            ExtractLeafs(value, leaf, leafs);
        }
        else{
            leafs.push(leaf);
        }
    });
}

export function GetLeafs(target: Record<string, any>){
    let leafs = new Array<string>();
    IsObject(target) && ExtractLeafs(target, '', leafs);
    return leafs;
}
