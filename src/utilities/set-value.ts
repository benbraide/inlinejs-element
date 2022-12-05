import { IsObject } from "@benbraide/inlinejs";

import { SpreadValue } from "./spread-value";
import { ToArray } from "./to-array";
import { ValueCast } from "./value-cast";

export function SetValue(target: Record<string, any>, key: string, value: any, cast = true): [string, any] | null{
    if (target.hasOwnProperty(key)){
        if (IsObject(target[key])){
            SpreadValue(target[key], ToArray(value), cast);
            return [key, target[key]];
        }
        
        return [key, (target[key] = (cast ? ValueCast(target[key], value) : value))];
    }

    for (let ownKey of Object.keys(target)){
        if (IsObject(target[ownKey])){
            let result = SetValue(target[ownKey], key, value);
            if (result){
                return result;
            }
        }
    }

    return null;
}
