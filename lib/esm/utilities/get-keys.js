import { IsObject } from "@benbraide/inlinejs";
function AddKeys(target, keys) {
    Object.entries(target).forEach(([key, value]) => {
        keys.push(key);
        IsObject(value) && AddKeys(value, keys);
    });
}
export function GetKeys(target) {
    let keys = new Array();
    IsObject(target) && AddKeys(target, keys);
    return keys;
}
