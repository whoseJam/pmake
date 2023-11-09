import { SDHelper } from "../../Utility/SDHelper";
import * as Rule from "../../Rule/Rule";

export function AbsElement(self) {
    self.background = background;
    
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

    self.value = value;
    self.color = SDHelper.args1Func("background", "color");
    self.opacity = opacity;
    self.update = update;
    self.inRange = SDHelper.forwardFunc("background", "inRange");

    return self;
}

function background() {
    return this.children.child("background");
}

function value(value) {
    if (value === undefined)
        return this.children.child("value");
    value = SDHelper.any2Slide(this, value);
    let ovalue = this.children.erase("value");
    ovalue?.opacity(0).remove();
    if (!value) return this;
    
    value.attachTo(this.layer("value"));
    value.opacity(0);
    this.children.push(
        "value", 
        value, 
        Rule.CenterFixAspect(this, value));
    value.startAnimate(this);
    value.opacity(1);
    return this;
}

function opacity(opacity) {
    this.children.child("background").opacity(opacity);
    let value = this.children.child("value");
    value?.opacity(opacity);
    return this;
}

function update() {
    let x = this.x();
    let y = this.y();
    let width = this.width();
    let height = this.height();
    let back = this.children.child("background");
    back.x(x).y(y);
    back.width(width);
    back.height(height);
    this.isDirty = false;
    this.children.update();
}