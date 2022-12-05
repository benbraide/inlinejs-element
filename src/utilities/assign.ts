import { IsObject } from "@benbraide/inlinejs";

export function AssignTarget(target: Record<string, any>, path: string): [Record<string, any>, string]{
    let parts = path.split('.');
    if (parts.length <= 1){
        return [target, path];
    }

    return [parts.slice(0, (parts.length - 1)).reduce((prev, cur) => {
        return (IsObject(prev[cur]) ? prev[cur] : (prev[cur] = {}));
    }, target), (parts.at(-1) || '')];
}

export function Assign(target: Record<string, any>, path: string, value: any){
    let [computedTarget, name] = AssignTarget(target, path);
    return (computedTarget[name] = value);
}
