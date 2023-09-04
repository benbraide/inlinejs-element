import { ToSnakeCase, GetGlobalScope, RandomString } from "@benbraide/inlinejs";

export interface IPropertyOptions{
    name?: string;
    type?: string;
    spread?: string;
    update?: boolean;
    initial?: any;
    checkStoredObject?: boolean;
    delimiter?: string;
};

export interface IProperty{
    name: string;
    type: string;
    spread: string;
    update: boolean;
    initial: any;
    checkStoredObject: boolean;
    delimiter: string;
    handler: (value: any, context: HTMLElement) => void;
    setInitial: ((cvalue: string, ontext: HTMLElement) => void) | null;
}

const globalPropertyScope = RandomString();

export function GetGlobalPropertyScope(){
    return globalPropertyScope;
}

export function GetProperties(){
    return <Record<string, Array<IProperty>>>GetGlobalScope(`customProperties.${globalPropertyScope}`);
}

export function GetPropertyScope(target: any, name?: string){
    if (!name){
        if ('constructor' in target){
            name = target.constructor.name;
        }
        else if (typeof target === 'function' || (typeof target === 'object' && ('name' in target))){
            name = target.name;
        }
    }

    return (name || '');
}

export function Property(options?: IPropertyOptions){
    return function (target: any, key: string, descriptor?: PropertyDescriptor){
        let name = '', setInitial: ((value: string, context: HTMLElement) => void) | null = null;
        if ((options?.initial !== undefined) || (!descriptor && options?.update)){
            options.initial = (options.initial || target[key]);
            if (options.type === 'boolean'){
                setInitial = (value, context) => {
                    if (value && value !== 'false'){
                        context.setAttribute(name, name);
                    }
                    else if (context.hasAttribute(name)){
                        context.removeAttribute(name);
                    }
                };
            }
            else{
                setInitial = (value, context) => {
                    context.setAttribute(name, value);
                };
            }
        }
        
        let handler: ((value: any, context: HTMLElement) => void) | null = null, property: IProperty = {
            name: '',
            type: (options?.type || 'string'),
            spread: (options?.spread || ''),
            update: (options?.update || false),
            initial: (options?.initial || undefined),
            checkStoredObject: (options?.checkStoredObject || false),
            delimiter: (options?.delimiter || ','),
            handler: (null as unknown as ((value: any, context: HTMLElement) => void)),
            setInitial,
        };

        if (!descriptor){
            name = ToSnakeCase(options?.name || key);
            handler = (value, context) => (context[key] = value);
        }
        else if (typeof descriptor.value === 'function' && !descriptor.get && !descriptor.set && (options?.name || /^Update.+Property/.test(descriptor.value.name))){
            const callback = descriptor.value;
            name = ToSnakeCase(options?.name || descriptor.value.name.replace(/^Update(.+)Property/, '$1'));
            handler = (value, context) => callback.call(context, value);
        }

        if (name && handler){
            property.name = name;
            property.handler = handler;

            const scope = GetPropertyScope(target);
            let properties = GetProperties();
            
            properties[scope] = (properties[scope] || new Array<IProperty>());
            properties[scope].push(property);
        }
    };
}
