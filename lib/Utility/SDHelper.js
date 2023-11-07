import { Text } from "../slide";

export const SDHelper = {
    forwardFunc: forwardFunc,
    proper1Func: proper1Func,
    proper2Func: proper2Func,
    positionFunc: positionFunc,
    keyValueFunc: keyValueFunc,
    any2Slide: any2Slide,
    isOpacity: isOpacity,
    isColor: isColor,
    isSlide: isSlide,
    isText: isText,
    opacity: opacity,
}

function forwardFunc(childId, name) {
    return function() {
        let child = this.children.child(childId);
        return child[name].apply(child, arguments);
    }
}

function proper1Func(childId, name) {
    return function(value) {
        let child = this.children.child(childId);
        if (value === undefined)
            return child[name]();
        child[name](value);
        return this;
    }
}

function proper2Func(childId, name) {
    return function(v1, v2) {
        let child = this.children.child(childId);
        if (v1 === undefined)
            return child[name]();
        child[name](v1, v2);
        return this;
    }
}

function positionFunc(childId, name) {
    let signals = [];
    for (let i = 2; i < arguments.length; i++)
        signals.push(arguments[i]);
    return function(value) {
        let child = this.children.child(childId);
        if (value === undefined)
            return child[name]();
        child[name](value);
        for (let i = 0; i < signals.length; i++)
            this.call(signals[i]);
        return this;
    }
}

function keyValueFunc(self, key, defaultValue) {
    self._[key] = defaultValue;
    return function(value) {
        if (value === undefined)
            return this._[key];
        this._[key] = value;
        return this;
    }
}

function any2Slide(self, any) {
    if (typeof(any) === "function")
        any = value(any);
    else if (typeof(any) === "string" || typeof(any) === "number")
        any = Text(self, any);
    else if (!SDHelper.isSlide(any))
        throw new Error("unrecognized any = ", any);
    return any;
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

function isOpacity(opacity) {
    return (typeof(opacity) === "number" && 0 <= opacity && opacity <= 1);
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

function isText(str) {
    return typeof(str) === "string" || typeof(str) === "number";
}

function opacity(opacity) {
    let children = this.children;
    children.forEach((child) => {
        child.opacity(opacity);
    });
    return this;
}