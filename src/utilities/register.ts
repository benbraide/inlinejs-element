import { GetGlobal, ToSnakeCase } from "@benbraide/inlinejs";

export function RegisterCustomElement(target: any, name?: string){
    let resolvedName = ToSnakeCase(name || target.name);
    console.log('RegisterCustomElement - original name:', name || target.name, 'snake case:', resolvedName);
    
    resolvedName = (resolvedName && GetGlobal().GetConfig().GetElementName(resolvedName));
    console.log('RegisterCustomElement - final resolved name:', resolvedName);
    
    if (resolvedName && !customElements.get(resolvedName)) {
        console.log('Registering element:', resolvedName);
        customElements.define(resolvedName, target);
        console.log('Element registered successfully:', resolvedName);
    } else {
        console.log('Element not registered. Resolved name:', resolvedName, 'Already exists:', !!customElements.get(resolvedName));
    }
};
