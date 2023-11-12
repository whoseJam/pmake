
import { SDHelper } from "../../Utility/SDHelper";
import { svg } from "../../Interact/Svg";
import { AbsArrayFocus } from "./AbsArrayFocus";
import { AbsArrayIndex } from "./AbsArrayIndex";

export function AbsArray(self) {
    self = AbsArrayIndex(self);
    self = AbsArrayFocus(self);
    self.fromExistedElem = SDHelper.keyBoolValueAsTrueFunc(self, "fromExistedElem", false);
    self.fromExistedValue = SDHelper.keyBoolValueAsTrueFunc(self, "fromExistedValue", false);
    self.preventRemoveElem = SDHelper.keyBoolValueAsTrueFunc(self, "preventRemoveElem", false);
    self.preventRemoveValue = SDHelper.keyBoolValueAsTrueFunc(self, "preventRemoveValue", false);
    self.start = start;
    self.end = end;
    self.idx = idx;
    self.push = push;
    self.pop = pop;
    self.resize = resize;
    self.insert = insert;
    self.erase = erase;
    self.length = length;
    self.element = element;
    self.value = value;
    self.opacity = opacity;
    self.color = color;
    self._.start = 0;
    self._.elements = [];
    return self;
}

function length() {
    let elems = this.get("elements");
    return elems.length;
}

function start(start) {
    if (start === undefined)
        return this._.start;
    this._.start = start;
    this.indexed(this.indexed());
    return this;
}

function end() {
    return this.start() + this.length() - 1;
}

function idx(i) {
    return i - this.start();
}

function element(i) {
    let elems = this.get("elements");
    return elems[this.idx(i)];
}

function push(value = null) {
    this.insert(this.end() + 1, value);
    return this;
}

function pop() {
    this.erase(this.end());
    return this;
}

function resize(size) {
    let len = this.length();
    while (len < size) { this.push(); len++; }
    while (len > size) { this.pop(); len--; }
    return this;
}

function insert(i, value = null) {
    let elem;
    if (this._.elementType) value = SDHelper.any2Slide(this, value);
    if (this._.fromExistedElem) elem = value;
    else if (this._.elementType) elem = this._.elementType(this.layer("elements"));
    else elem = value;
    this._.elements.splice(this.idx(i), 0, elem);

    this.extInsert(i, elem, value);
    if (SDHelper.isSlide(elem)) {
        this.children.push(elem);
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
    }
    this.call("onInsert");
    return this;
}

function erase(i) {
    let elem = this.element(i);
    this._.elements.splice(this.idx(i), 1);

    if (SDHelper.isSlide(elem)) {
        this.children.erase(elem);
        if (this._.preventRemoveElem) {
            elem.attachTo(svg());
            elem.endAnimate();
        } else if (this._.preventRemoveValue) {
            elem.preventRemove().value(null);
            elem.opacity(0).remove();
        } else {
            elem.opacity(0).remove();
        }
    }
    this.extErase(i, elem);
    this.update();

    this._.preventRemoveElem = false;
    this._.preventRemoveValue = false;

    this.call("onErase");
    return this;
}

function value1(i) {
    return this.element(i).value(); 
}
function value2(i, v) {
    v = SDHelper.any2Slide(this, v);
    let elem = this.element(i);
    if (this._.fromExistedValue)
        elem.fromExisted();
    elem.value(v);
    this._.fromExistedValue = false;
    return this;
}
function value() {
    if (arguments.length === 1) return value1.apply(this, arguments);
    if (arguments.length === 2) return value2.apply(this, arguments);
    throw new Error("invalid arguments");
}

function opacity1(v1) {
    if (SDHelper.isOpacity(v1)) {
        SDHelper.opacity.call(this, v1);
        return this;
    } else if (typeof(v1) === "number")
        return this.element(v1).opacity();
    throw new Error("invalid arguments");
}
function opacity2(v1, v2) {
    if (SDHelper.isOpacity(v2)) {
        this.element(v1).opacity(v2);
        return this;
    }
    throw new Error("invalid arguments");
}
function opacity() {
    if (arguments.length === 1) return opacity1.apply(this, arguments);
    if (arguments.length === 2) return opacity2.apply(this, arguments);
    throw new Error("invalid arguments");
}

function color1(v1) {
    if (SDHelper.isColor(v1)) {
        for (let i = 0; i < this.length(); i++)
            this._.elements[i].color(v1);
        return this;
    } else if (typeof(v1) === "number")
        return this.element(v1).color();
    throw new Error("invalid arguments");
}
function color2(v1, v2) {
    if (SDHelper.isColor(v2)) {
        this.element(v1).color(v2);
        return this;
    }
    throw new Error("invalid arguments");
}
function color() {
    if (arguments.length === 1) return color1.apply(this, arguments);
    if (arguments.length === 2) return color2.apply(this, arguments);
    throw new Error("invalid arguments");
}