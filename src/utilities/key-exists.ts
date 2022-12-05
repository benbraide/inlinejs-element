import { IsObject } from "@benbraide/inlinejs";

export function KeyExists(key: string, target: Record<string, any>){
    if (!key || !IsObject(target)){
        return false;
    }

    if (target.hasOwnProperty(key)){
        return true;
    }

    return (Object.values(target).findIndex(val => KeyExists(key, val)) != -1);
}
