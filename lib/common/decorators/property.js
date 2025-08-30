"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = exports.GetPropertyScope = exports.GetProperties = exports.GetGlobalPropertyScope = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
;
const globalPropertyScope = (0, inlinejs_1.RandomString)();
function GetGlobalPropertyScope() {
    return globalPropertyScope;
}
exports.GetGlobalPropertyScope = GetGlobalPropertyScope;
function GetProperties() {
    return (0, inlinejs_1.GetGlobalScope)(`customProperties.${globalPropertyScope}`);
}
exports.GetProperties = GetProperties;
function GetPropertyScope(target, name) {
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
exports.GetPropertyScope = GetPropertyScope;
function Property(options) {
    return function (target, key, descriptor) {
        let name = '', setInitial = null;
        const initial = (options && 'initial' in options) ? options.initial : undefined;
        if (initial !== undefined || (!descriptor && (options === null || options === void 0 ? void 0 : options.update))) {
            if ((options === null || options === void 0 ? void 0 : options.type) === 'boolean') {
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
            initial: initial,
            checkStoredObject: ((options === null || options === void 0 ? void 0 : options.checkStoredObject) || false),
            delimiter: ((options === null || options === void 0 ? void 0 : options.delimiter) || ','),
            handler: null,
            setInitial,
        };
        if (!descriptor) {
            name = (0, inlinejs_1.ToSnakeCase)((options === null || options === void 0 ? void 0 : options.name) || key);
            handler = (value, context) => (context[key] = value);
        }
        else if (typeof descriptor.value === 'function' && !descriptor.get && !descriptor.set && ((options === null || options === void 0 ? void 0 : options.name) || /^Update.+Property/.test(descriptor.value.name))) {
            const callback = descriptor.value;
            name = (0, inlinejs_1.ToSnakeCase)((options === null || options === void 0 ? void 0 : options.name) || descriptor.value.name.replace(/^Update(.+)Property/, '$1'));
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
exports.Property = Property;
