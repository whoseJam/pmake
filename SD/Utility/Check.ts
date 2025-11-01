import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Color } from "./Color";

export class Check {
    static isFalse(object: any) {
        return object === null || object === undefined || object === false;
    }
    static isEmpty(object: any) {
        return object === null || object === undefined;
    }
    static isString(object: any) {
        return typeof object === "string";
    }
    static isOpacity(object: any) {
        if (typeof object !== "number") return false;
        return 0 <= object && object <= 1;
    }
    static isNumber(object: any) {
        return typeof object === "number" && !isNaN(object) && object !== Infinity && object !== -Infinity;
    }
    static isNumberOrString(object: any) {
        return typeof object === "number" || typeof object === "string";
    }
    static isVector(object: any) {
        return object && typeof object[0] === "number" && typeof object[1] === "number";
    }
    static isAsyncFunction(object: any) {
        if (typeof object !== "function") return false;
        const str = object.toString();
        return str.startsWith("async");
    }
    static isSyncFunction(object: any) {
        if (typeof object !== "function") return false;
        return !this.isAsyncFunction(object);
    }

    static validateOpacity(object: any, method: string, i = 1, suggestions = []) {
        if (!this.isOpacity(object)) ErrorLauncher.invalidOpacity(object, method, i, suggestions);
    }
    static validateNumber(object: any, method: string, i = 1, suggestions = []) {
        if (!this.isNumber(object)) ErrorLauncher.invalidNumber(object, method, i, suggestions);
    }
    static validateString(object: any, method: string, i = 1, suggestions = []) {
        if (!this.isString(object)) ErrorLauncher.invalidString(object, method, i, suggestions);
    }
    static validateNumberOrString(object: any, method: string, i = 1, suggestions = []) {
        if (!this.isNumberOrString(object)) ErrorLauncher.invalidNumberOrString(object, method, i, suggestions);
    }
    static validateColor(object: any, method: string, i = 1, suggestions = []) {
        if (!Color.isColor(object)) ErrorLauncher.invalidColor(object, method, i, suggestions);
    }
    static validateSyncFunction(object: any, method: string, i = 1, suggestions = []) {
        if (!this.isSyncFunction(object)) ErrorLauncher.invalidSyncFunction(object, method, i, suggestions);
    }
    static validateLocation(object: any, locations: ReadonlySet<string>, method: string, i = 1, suggestions = []) {
        if (!locations.has(object)) ErrorLauncher.invalidLocation(object, method, i, suggestions);
    }
    static validateDirection(object: any, directions: ReadonlySet<string>, method: string, i = 1, suggestions = []) {
        if (!directions.has(object)) ErrorLauncher.invalidDirection(object, method, i, suggestions);
    }
    static validateAlign(object: any, aligns: ReadonlySet<string>, method: string, i = 1, suggestions = []) {
        if (!aligns.has(object)) ErrorLauncher.invalidAlign(object, method, i, suggestions);
    }
    static validateJustify(object: any, justifies: ReadonlySet<string>, method: string, i = 1, suggestions = []) {
        if (!justifies.has(object)) ErrorLauncher.invalidJustify(object, method, i, suggestions);
    }
    static validateOrigin(object: any, origins: ReadonlySet<string>, method: string, i = 1, suggestions = []) {
        if (!origins.has(object)) ErrorLauncher.invalidOrigin(object, method, i, suggestions);
    }
    static validateSDNode(object: any, method: string, i = 1, suggestions = []) {
        const { SDNode } = require("@/Node/SDNode");
        if (!(object instanceof SDNode)) ErrorLauncher.invalidSDNode(object, method, i, suggestions);
    }
    static validateArgumentsCountEqualTo(args: Array<any>, count: number, method: string) {
        if (args.length !== count)
            throw new Error(`The ${method} expect ${count} arguments, but got ${args.length} arguments.`);
    }
}
