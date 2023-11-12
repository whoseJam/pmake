
import { SDHelper } from "../../Utility/SDHelper";
import * as Common from "../Common";

export function AbsGrid(self) {
    self.startN = startN;
    self.startM = startM;
    self.fromExistedElem = SDHelper.keyBoolValueAsTrueFunc(self, "fromExistedElem", false);
    self.fromExistedValue = SDHelper.keyBoolValueAsTrueFunc(self, "fromExistedValue", false);
    self.preventRemoveElem = SDHelper.keyBoolValueAsTrueFunc(self, "preventRemoveElem", false);
    self.preventRemoveValue = SDHelper.keyBoolValueAsTrueFunc(self, "preventRemoveValue", false);
    self.idxN = idxN;
    self.idxM = idxM;
    self.element = element;
    self.value = value;
    self.opacity = opacity;
    self.color = color;
    return self;
}

function startN(start) {
    if (start === undefined)
        return this.get("startN");
    this.set("startN", start);
    return this;
}

function startM(start) {
    if (start === undefined)
        return this.get("startM");
    this.set("startM", start);
    return this;
}

function idxN(i) {
    return i - this.startN();
}

function idxM(j) {
    return j - this.startM();
}

function element(i, j) {
    let elems = this.get("elements");
    return elems[this.idxN(i)][this.idxM(j)];
}

function value2(i, j) {
    let elem = this.element(i, j);
    return elem;
}
function value3(i, j, value) {
    let elem = this.element(i, j);
    if (this._.fromExistedValue)
        elem.fromExisted();
    elem.value(value);
    this._.fromExistedValue = false;
    return this;
}
function value() {
    if (arguments.length === 2) return value2.apply(this, arguments);
    if (arguments.length === 3) return value3.apply(this, arguments);
    throw new Error("invalid arguments");
}

function opacity(i, j, opacity) {
    if (arguments.length === 1) {
        let opacity = arguments[0];
        Common.opacity.call(this, opacity);
        return this;
    } else if (arguments.length === 2) {
        let elem = this.element(i, j);
        return elem.opacity();
    } else if (arguments.length === 3) {
        let elem = this.element(i, j);
        elem.opacity(opacity);
        return this;
    } else throw new Error("invalid arguments");
}

function color(i, j, color) {
    if (arguments.length === 1) {
        let color = arguments[0];
        this.children.forEach((child) => {
            child.color(color);
        });
    } else if (arguments.length === 2) {
        let elem = this.element(i, j);
        return elem.color();
    } else if (arguments.length === 3) {
        let elem = this.element(i, j);
        elem.color(color);
    } else throw new Error("invalid arguments");
    return this;
}