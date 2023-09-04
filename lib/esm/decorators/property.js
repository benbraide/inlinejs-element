import { ToSnakeCase, GetGlobalScope, RandomString } from "@benbraide/inlinejs";
;
const globalPropertyScope = RandomString();
export function GetGlobalPropertyScope() {
    return globalPropertyScope;
}
export function GetProperties() {
    return GetGlobalScope(`customProperties.${globalPropertyScope}`);
}
export function GetPropertyScope(target, name) {
    if (!name) {
        if ('constructor' in target) {
            name = target.constructor.name;
        }
        else if (typeof target === 'function' || (typeof target === 'object' && ('name' in target))) {
            name = target.name;
        }
    }
    return (name || '');
}
export function Property(options) {
    return function (target, key, descriptor) {
        let name = '', setInitial = null;
        if (((options === null || options === void 0 ? void 0 : options.initial) !== undefined) || (!descriptor && (options === null || options === void 0 ? void 0 : options.update))) {
            options.initial = (options.initial || target[key]);
            if (options.type === 'boolean') {
                setInitial = (value, context) => {
                    if (value && value !== 'false') {
                        context.setAttribute(name, name);
                    }
                    else if (context.hasAttribute(name)) {
                        context.removeAttribute(name);
                    }
                };
            }
            else {
                setInitial = (value, context) => {
                    context.setAttribute(name, value);
                };
            }
        }
        let handler = null, property = {
            name: '',
            type: ((options === null || options === void 0 ? void 0 : options.type) || 'string'),
            spread: ((options === null || options === void 0 ? void 0 : options.spread) || ''),
            update: ((options === null || options === void 0 ? void 0 : options.update) || false),
            initial: ((options === null || options === void 0 ? void 0 : options.initial) || undefined),
            checkStoredObject: ((options === null || options === void 0 ? void 0 : options.checkStoredObject) || false),
            delimiter: ((options === null || options === void 0 ? void 0 : options.delimiter) || ','),
            handler: null,
            setInitial,
        };
        if (!descriptor) {
            name = ToSnakeCase((options === null || options === void 0 ? void 0 : options.name) || key);
            handler = (value, context) => (context[key] = value);
        }
        else if (typeof descriptor.value === 'function' && !descriptor.get && !descriptor.set && ((options === null || options === void 0 ? void 0 : options.name) || /^Update.+Property/.test(descriptor.value.name))) {
            const callback = descriptor.value;
            name = ToSnakeCase((options === null || options === void 0 ? void 0 : options.name) || descriptor.value.name.replace(/^Update(.+)Property/, '$1'));
            handler = (value, context) => callback.call(context, value);
        }
        if (name && handler) {
            property.name = name;
            property.handler = handler;
            const scope = GetPropertyScope(target);
            let properties = GetProperties();
            properties[scope] = (properties[scope] || new Array());
            properties[scope].push(property);
        }
    };
}
