
export class SDMember {
    constructor();

    new(key: number|string, value: any): void;
    get(key: number|string): any;

    dirty(key: number|string): void;

    set(key: number|string, value: any): void;
    setByEqual(key: number|string, value: any): void;
    setByDqual(key: number|string, value: any): void;

    hasChanged(key: number|string): boolean;

    oldValue(key: number|string): any;
    
    flush(key: number|string): void;
}