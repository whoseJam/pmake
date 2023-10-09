
function kvset(key, def) {
    this.set(key, def);
    return function(value) {
        if (value === undefined)
            return this.get(key);
        this.set(key, value);
        return this;
    }
}

export function AbsElement(self) {
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