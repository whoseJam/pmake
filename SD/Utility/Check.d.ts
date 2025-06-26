export class Check {
    static isFalseType(object: any): boolean;
    static isEmptyType(object: any): boolean;
    static isNumberOrString(object: any): boolean;
    static isTypeOfString(object: any): boolean;
    static isTypeOfOpacity(object: any): boolean;
    static isTypeOfColor(object: any): boolean;
    static isValidNumber(object: any): boolean;
    static isTypeOfVector(object: any): boolean;
    static isColor(object: any): boolean;
    static isSDColor(object: any): boolean;
    static isHexColor(object: any): boolean;
    static isAsyncFucntion(object: any): boolean;
    static isSyncFunction(object: any): boolean;

    static validateNumber(object: any, method: string): void;
    static validateColor(object: any): void;
    static validateSyncFunction(object: any): void;
    static validateArgumentsCountEqualTo(arguments: Array<any>, count: number, method: string): void;
}
