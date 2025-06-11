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
}
