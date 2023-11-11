import { SDHelper } from "../../Utility/SDHelper";
import * as Rule from "../../Rule/Rule";
import { svg } from "../../Interact/Svg";

export function AbsElement(self) {
    self.background = background;
    self.fromExisted = SDHelper.keyBoolValueAsTrueFunc(self, "fromExisted", false);
    self.preventRemove = SDHelper.keyBoolValueAsTrueFunc(self, "preventRemove", false);
    self.fill = SDHelper.args1Func("background", "fill");
    self.fillOpacity = SDHelper.args1Func("background", "fillOpacity");
    self.stroke = SDHelper.args1Func("background", "stroke");
    self.strokeOpacity = SDHelper.args1Func("background", "strokeOpacity");
    self.strokeWidth = SDHelper.args1Func("background", "strokeWidth");
    self.strokeDashOffset = SDHelper.args1Func("background", "strokeDashOffset");
    self.strokeDashArray = SDHelper.args1Func("background", "strokeDashArray");
    self.value = value;
    self.color = SDHelper.args1Func("background", "color");
    self.opacity = opacity;
    self.update = update;
    self.inRange = SDHelper.forwardFunc("background", "inRange");
    self._.width = 40;
    self._.height = 40;
    self._.valueRule = Rule.CenterFixAspect();
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
    if (ovalue) {
        if (this._.preventRemove) {
            ovalue.attachTo(svg());
            ovalue.endAnimate();
        } else {
            ovalue.opacity(0);
            ovalue.remove();
        }
        this._.preventRemove = false;
    }
    if (!value) return this;
    value.attachTo(this.layer("value"));
    if (this._.fromExisted) {
        console.log("this.fromExited=", this._.fromExisted);
        value.startAnimate(this);
        this.children.push("value", value, this._.valueRule);
    } else {
        value.opacity(0);
        this.children.push("value", value, this._.valueRule);
        value.startAnimate(this);
        value.opacity(1);
    }
    this._.fromExisted = false;
    return this;
}

function opacity(opacity) {
    this.children.child("background").opacity(opacity);
    let value = this.children.child("value");
    value?.opacity(opacity);
    return this;
}

function update() {
    this.isDirty = false;
    this.children.update();
}