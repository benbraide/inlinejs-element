import { GetGlobal, ToSnakeCase } from "@benbraide/inlinejs";
export function Register(name) {
    return function (target) {
        let resolvedName = ToSnakeCase(name || target.name);
        resolvedName = (resolvedName && GetGlobal().GetConfig().GetElementName(resolvedName));
        resolvedName && !customElements.get(resolvedName) && customElements.define(resolvedName, target);
    };
}
