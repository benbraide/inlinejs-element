import { IsObject } from "@benbraide/inlinejs";
export function KeyExists(key, target) {
    if (!key || !IsObject(target)) {
        return false;
    }
    if (target.hasOwnProperty(key)) {
        return true;
    }
    return (Object.values(target).findIndex(val => KeyExists(key, val)) != -1);
}
