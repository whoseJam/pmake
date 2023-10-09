import { equal } from "./Math";

export const Traiter = {
    isSlide: isSlide,
    isColor: isColor,
    isValue: isValue,
    isOpacity: isOpacity,
    isValidNumber: isValidNumber,
    isText: isText,
}

function isSlide(obj) {
    if (!obj) return false;
    if (typeof(obj.type) === "function" &&
        typeof(obj.parent) === "function" &&
        typeof(obj.startAnimate) === "function") {
        return true;
    }
    return false;
}

function isColor(str) {
    if (str === undefined)
        return false;
    if (typeof(str) === "object" && 
        typeof(str.main) !== "undefined" && 
        typeof(str.border) !== "undefined")
        return true;
    if (str[0] !== "#") return false;
    for (let i = 1; i < str.length; i++) {
        if ("0" <= str[i] && str[i] <= "9");
        else if ("a" <= str[i] && str[i] <= "f");
        else if ("A" <= str[i] && str[i] <= "F");
        else return false;
    }
    if (4 <= str.length && str.length <= 7) return true;
    return false;
}

function isOpacity(opacity) {
    if (typeof(opacity) === "number" &&
        0 <= opacity && opacity <= 1) return true;
    return false;
}

function isValue(value) {
    if (isSlide(value)) return true;
    return false;
}

function isValidNumber(number) {
    if (typeof(number) !== "number") return false;
    if (number === NaN) return false;
    if (number === Infinity) return false;
    if (equal(number, 0)) return false;
    return true;
}

function isText(text) {
    return typeof(text) === "number" || typeof(text) === "string";
}