import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export class Check {
    static isFalseType(object) {
        return object === null || object === undefined || object === false;
    }
    static isEmptyType(object) {
        return object === null || object === undefined;
    }
    static isNumberOrString(object) {
        return typeof object === "number" || typeof object === "string";
    }
    static isTypeOfString(object) {
        return typeof object === "string";
    }
    static isTypeOfOpacity(object) {
        if (typeof object !== "number") return false;
        return 0 <= object && object <= 1;
    }
    static isTypeOfColor(object) {
        if (typeof object === "string" && object.startsWith("#")) return true;
        else if (typeof object === "object" && object.main && object.border) return true;
        return false;
    }
    static isValidNumber(object) {
        return typeof object === "number" && !isNaN(object) && object !== Infinity && object !== -Infinity;
    }
    static isTypeOfVector(object) {
        return object && typeof object[0] === "number" && typeof object[1] === "number";
    }
    static isColor(object) {
        return this.isHexColor(object) || this.isSDColor(object);
    }
    static isSDColor(object) {
        if (!object) return false;
        if (typeof object !== "object") return false;
        return this.isHexColor(object.fill) && this.isHexColor(object.stroke);
    }
    static isHexColor(object) {
        if (!object) return false;
        if (typeof object !== "string") return false;
        if (object.length !== 7) return false;
        if (object[0] !== "#") return false;
        for (let i = 1; i <= 6; i++) if ("0123456789aAbBcCdDeEfF".indexOf(object[i]) === -1) return false;
        return true;
    }
    static isAsyncFunction(object) {
        if (typeof object !== "function") return false;
        const str = object.toString();
        return str.startsWith("async");
    }
    static isSyncFunction(object) {
        if (typeof object !== "function") return false;
        return !this.isAsyncFunction(object);
    }

    static validateNumber(object, method) {
        if (!this.isValidNumber(object)) ErrorLauncher.invalidNumber(object, method);
    }
    static validateColor(object) {
        if (!this.isColor(object)) ErrorLauncher.invalidColorFormat(object);
    }
    static validateSyncFunction(object, method) {
        if (!this.isSyncFunction(object)) ErrorLauncher.invalidSyncFunction(object, method);
    }
}
