import { GetGlobal, ToSnakeCase } from "@benbraide/inlinejs";
export function RegisterCustomElement(target, name) {
    let resolvedName = ToSnakeCase(name || target.name);
    resolvedName = (resolvedName && GetGlobal().GetConfig().GetElementName(resolvedName));
    resolvedName && !customElements.get(resolvedName) && customElements.define(resolvedName, target);
}
;
