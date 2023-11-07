
import { SDHelper } from "../../Utility/SDHelper";

export function AbsArray(self) {
    self.start = SDHelper.keyValueFunc(self, "start", 0);
    self.end = end;
    self.idx = idx;
    self.push = push;
    self.pop = pop;
    self.resize = resize;
    self.length = length;
    self.element = element;
    self.value = value;
    self.opacity = opacity;
    self.color = color;

    self._.elements = [];
    self.mode = SDHelper.keyValueFunc(self, "mode", "strong");

    self.preIn = SDHelper.keyValueFunc(self, "preIn", () => {});
    self.in = SDHelper.keyValueFunc(self, "in", (elem) => {
        if (self._.mode === "strong") elem.opacity(0);
        elem.startAnimate(self)
        if (self._.mode === "strong") elem.opacity(1);
    });
    self.preOut = SDHelper.keyValueFunc(self, "preOut", () => {});
    self.out = SDHelper.keyValueFunc(self, "out", (elem) => {
        if (self._.mode === "strong")
            elem.opacity(0).remove();
    });

    return self;
}

function length() {
    let elems = this.get("elements");
    return elems.length;
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

function value1(i) {
    return this.element(i).value(); 
}
function value2(i, v) {
    v = SDHelper.any2Slide(this, v);
    this.element(i).value(v);
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