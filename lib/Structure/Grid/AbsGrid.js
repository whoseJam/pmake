
import * as Common from "../Common";

export function AbsGrid(self) {

    self.startN = startN;
    self.startM = startM;
    self.idxN = idxN;
    self.idxM = idxM;
    self.element = element;
    self.value = value;
    self.opacity = opacity;
    self.color = color;
    self.inRange = Common.inRange;
    self.remove = Common.remove;

    self.preIn = kvset.call(self, "preIn", () => {});
    self.in = kvset.call(self, "in", (elem) => {
        elem.opacity(0)
            .startAnimate(self)
            .opacity(1);
    });
    self.preOut = kvset.call(self, "preOut", () => {});
    self.out = kvset.call(self, "out", (elem) => {
        elem.opacity(0).remove();
    });

    return self;
}

function kvset(key, def) {
    this.set(key, def);
    return function(value) {
        if (value === undefined)
            return this.get(key);
        this.set(key, value);
        return this;
    }
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

function value(i, j, value) {
    if (arguments.length === 2) {
        let elem = this.element(i, j);
        return elem.value();
    } else if (arguments.length === 3) {
        let elem = this.element(i, j);
        elem.value(value);
    } else throw new Error("invalid arguments");
    return this;
}

function opacity(i, j, opacity) {
    if (arguments.length === 1) {
        let opacity = arguments[0];
        Common.opacity.call(this, opacity);
    } else if (arguments.length === 2) {
        let elem = this.element(i, j);
        return elem.opacity();
    } else if (arguments.length === 3) {
        let elem = this.element(i, j);
        elem.opacity(opacity);
    } else throw new Error("invalid arguments");
    return this;
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