import { IsObject } from "@benbraide/inlinejs";

function AddKeys(target: Record<string, any>, keys: Array<string>){
    Object.entries(target).forEach(([key, value]) => {
        keys.push(key);
        IsObject(value) && AddKeys(value, keys);
    });
}

export function GetKeys(target: Record<string, any>){
    let keys = new Array<string>();
    IsObject(target) && AddKeys(target, keys);
    return keys;
}
