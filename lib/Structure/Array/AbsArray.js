
import * as Common from "../Common";

function kvset(key, def) {
    this.set(key, def);
    return function(value) {
        if (value === undefined)
            return this.get(key);
        this.set(key, value);
        return this;
    }
}

export function AbsArray(self) {
    self.set("start", 0);

    self.start = start;
    self.end = end;
    self.idx = idx;
    self.element = element;
    self.value = value;
    self.pop = pop;
    self.resize = resize;
    self.opacity = opacity;
    self.color = color;
    self.length = length;

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

function length() {
    let elems = this.get("elements");
    return elems.length;
}

function start(start) {
    if (start === undefined)
        return this.get("start");
    this.set("start", start);
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

function value() {
    if (arguments.length === 1) {
        let i = arguments[0];
        let elem = this.element(i);
        return elem.value();
    } else if (arguments.length === 2) {
        let i = arguments[0];
        let value = arguments[1];
        if (typeof(value) === "function")
            value = value(this.layer("values"));
        this.element(i).value(value);
    } else throw new Error("invalid arguments");
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

function opacity() {
    if (arguments.length === 1) {
        let opacity = arguments[0];
        Common.opacity.call(this, opacity);
    } else if (arguments.length === 2) {
        let i = arguments[0];
        let opacity = arguments[1];
        let elem = this.element(i);
        elem.opacity(opacity);
    } else throw new Error("invalid arguments");
    return this;
}

function color() {
    if (arguments.length === 1) {
        let color = arguments[0];
        for (let i = this.start(); i <= this.end(); i++) {
            this.element(i).color(color);
        }
    } else if (arguments.length === 2) {
        let i = arguments[0];
        let color = arguments[1];
        let elem = this.element(i);
        elem.color(color);
    } else throw new Error("invalid arguments");
    return this;
}