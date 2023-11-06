import { trim } from "../../slide";

function kvset(key, def) {
    this.set(key, def);
    return function(value) {
        if (value === undefined)
            return this.get(key);
        this.set(key, value);
        return this;
    }
}

export function AbsLink(self) {
    self.background = background;
    
    self._.mode = "strong";
    self.mode = mode;

    self.preIn = kvset.call(self, "preIn", () => {});
    self.in = kvset.call(self, "in", (elem) => {
        if (self._.mode === "strong") elem.opacity(0);
        elem.startAnimate(self)
        if (self._.mode === "strong") elem.opacity(1);
    });
    self.preOut = kvset.call(self, "preOut", () => {});
    self.out = kvset.call(self, "out", (elem) => {
        if (self._.mode === "strong")
            elem.opacity(0).remove();
    });

    self.from = endpointFunc("from", "source");
    self.to = endpointFunc("to", "target");

    return self;
}

function background() {
    return this.children.child("background");
}

function mode(mode) {
    if (mode === undefined)
        return this._.mode;
    this._.mode = mode;
    return this;
}

function endpointFunc(type, setfunc) {
    return function(elem) {
        this._[type + "Elem"] = elem;
        this[setfunc](elem.cx(), elem.cy());
        if (this._.fromElem && this._.toElem) {
            this.source(this._.fromElem.cx(), this._.fromElem.cy());
            this.target(this._.toElem.cx(), this._.toElem.cy());
            trim(this, this._.fromElem, this._.toElem);
        }
        return this;
    }
}
