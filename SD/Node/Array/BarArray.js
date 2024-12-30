import { Array } from "@/Node/Array/Array";
import { BaseArray } from "@/Node/Array/BaseArray";
import { Rect } from "@/Node/Nake/Rect";
import { Enter as EN } from "@/Node/SDNode/Enter";
import { effect } from "@/Node/SDNode/SDValue";
import { Factory } from "@/Utility/Factory";

export function BarArray(parent) {
    BaseArray.call(this, parent);

    this.type("BarArray");

    this.vars.merge({
        x: 0,
        y: 0,
        elementWidth: 40,
        elementHeight: 40,
        height: 0
    });

    this._.updater = effect(() => {
        const y = this.my();
        let maxHeight = 0;
        this.vars.elements.forEach((element, i) => {
            element.width(this.elementWidth());
            element.height(this.elementHeight() * element.value());
            element.x(this.x() + i * this.elementWidth());
            element.my(y);
            maxHeight = Math.max(maxHeight, this.elementHeight() * element.value());
        });
        this.vars.height = maxHeight;
        this.vars.y = y - maxHeight;
    });
}

BarArray.prototype = {
    ...BaseArray.prototype
};

BarArray.prototype.elementWidth = Factory.handlerLowPrecise("elementWidth");
BarArray.prototype.elementHeight = Factory.handlerLowPrecise("elementHeight");

BarArray.prototype.intValue = function (idx) {
    return this.value(idx);
}

BarArray.prototype.width = Array.prototype.width;
BarArray.prototype.height = function (height) {
    if (height === undefined) return this.vars.height;
    const elements = this.vars.elements;
    let maxValue = Math.max(1, elements.reduce((maxValue, element) => Math.max(maxValue, element.value())));
    this.elementHeight(height / maxValue);
    return this;
}

BarArray.prototype.insert = function (index, value) {
    value = +value;
    if (typeof (value) !== "number") throw new Error("Invalid Arguments");
    const element = new Rect(this.layer("elements")).opacity(0);
    element.vars.value = value;
    element.value = function (value) {
        if (value === undefined) return this.vars.value;
        this.vars.value = value;
        const baseline = this.my();
        this.height(value * this.parent.elementHeight());
        this.my(baseline);
        return this;
    }
    element.intValue = function () {
        return this.value();
    }
    element.onEnter(EN.appear("elements"));
    this.insertByBaseArray(index, element);
    return this;
}