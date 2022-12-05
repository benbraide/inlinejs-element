import { IsObject, ToString } from "@benbraide/inlinejs";

export function ValueCast(target: any, value: any){
    let stringValue = ToString(value);
    if (typeof target === 'boolean'){
        return (stringValue === 'true');
    }

    if (typeof target === 'number'){
        return (parseFloat(stringValue) || 0);
    }

    if (Array.isArray(target)){
        return stringValue.split(',');
    }

    if (IsObject(target)){
        try{
            return JSON.parse(stringValue);
        }
        catch{}

        return {};
    }

    return ((typeof target === 'string') ? stringValue : value);
}
