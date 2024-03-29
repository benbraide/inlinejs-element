export interface IPropertyOptions {
    name?: string;
    type?: string;
    spread?: string;
    update?: boolean;
    initial?: any;
    checkStoredObject?: boolean;
    delimiter?: string;
}
export interface IProperty {
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
export declare function GetGlobalPropertyScope(): string;
export declare function GetProperties(): Record<string, IProperty[]>;
export declare function GetPropertyScope(target: any, name?: string): string;
export declare function Property(options?: IPropertyOptions): (target: any, key: string, descriptor?: PropertyDescriptor | undefined) => void;
