
import { SDHelper } from "../../Utility/SDHelper";
import * as Common from "../../Structure/Common";
import { Box } from "../../Structure/Element/Box";

export function AbsGrid(self) {
    self.startN = startN;
    self.startM = startM;
    self.endN = endN;
    self.endM = endM;
    self.fromExistedElem = SDHelper.keyBoolValueAsTrueFunc(self, "fromExistedElem", false);
    self.fromExistedValue = SDHelper.keyBoolValueAsTrueFunc(self, "fromExistedValue", false);
    self.preventRemoveElem = SDHelper.keyBoolValueAsTrueFunc(self, "preventRemoveElem", false);
    self.preventRemoveValue = SDHelper.keyBoolValueAsTrueFunc(self, "preventRemoveValue", false);
    self.n = n;
    self.m = m;
    self.insert = insert;
    self.idxN = idxN;
    self.idxM = idxM;
    self.pushRow = pushRow;
    self.pushCol = pushCol;
    self.element = element;
    self.value = value;
    self.opacity = opacity;
    self.color = color;
    self.elementType = SDHelper.keyValueFunc(self, "elementType", Box);
    self.elementWidth = elementWidth;
    self.elementHeight = elementHeight;
    self._.n = 0;
    self._.m = 0;
    self._.startN = 0;
    self._.startM = 0;
    self._.elementWidth = 40;
    self._.elementHeight = 40;
    self._.elements = [];
    return self;
}

function n(n) {
    let on = this._.n;
    if (n === undefined) return on;
    while (on < n) { this.pushRow(); on++; }
    while (on > n) { this.popRow(); on--; }
    return this;
}

function m(m) {
    let om = this._.m;
    if (m === undefined)
        return this._.m;
    while (om < m) { this.pushCol(); om++; }
    while (om > m) { this.popCol(); om--; }
    return this;
}

function pushCol() {
    let elems = this._.elements;
    let n = elems.length;
    if (n === 0) elems.push([]), n++;
    for (let i = 0; i < n; i++) {
        let ri = i + this._.startN;
        let rj = elems[i].length;
        this.insert(ri, rj, null);
    }
    return this;
}

function pushRow() {
    let elems = this._.elements;
    let n = elems.length, m = this.m();
    let ri = n + this._.startN;
    if (m === 0) elems.push([]);
    for (let j = 0; j < m; j++) {
        let rj = j + this._.startM;
        this.insert(ri, rj, null);
    }
    return this;
}

function elementWidth(width) {
    if (width === undefined)
        return this.get("elementWidth");
    this.set("elementWidth", width);
    this.width(width * this.m());
    return this;
}

function elementHeight(height) {
    if (height === undefined)
        return this.get("elementHeight");
    this.set("elementHeight", height);
    this.height(height * this.n());
    return this;
}

function insert(i, j, value = null) {
    let elem;
    if (this._.elementType) value = SDHelper.any2Slide(this, value);
    if (this._.fromExistedElem) elem = value;
    else if (this._.elementType) elem = this._.elementType(this.layer("elements"));
    else elem = value;
    let elems = this._.elements;
    while (elems.length <= this.idxN(i))
        elems.push([]);
    this._.n = Math.max(this._.n, elems.length);
    for (let i = 0; i < elems.lengthl; i++)
        this._.m = Math.max(this._.m, elems[i].length);
    elems[this.idxN(i)].splice(this.idxM(j), 0, elem);
    this.children.push(elem);

    this.extInsert(elem, arguments);
    if (this._.fromExistedElem) {
        elem.attachTo(this.layer("elements"));
        elem.startAnimate(this);
        this.update();
    } else if (this._.fromExistedValue) {
        elem.opacity(0);
        this.update();
        elem.startAnimate(this);
        if (elem !== value) elem.fromExisted().value(value);
        elem.opacity(1);
    } else {
        if (elem !== value) elem.value(value);
        elem.opacity(0);
        this.update();
        elem.startAnimate(this);
        elem.opacity(1);
    }
    this._.fromExistedElem = false;
    this._.fromExistedValue = false;
    this.call("onInsert");
    return this;
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

function endN() {
    return this.startN() + this.n() - 1;
}

function endM() {
    return this.startM() + this.m() - 1;
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