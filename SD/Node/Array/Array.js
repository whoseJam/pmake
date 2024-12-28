import { BaseArray } from "@/Node/Array/BaseArray";
import { Box } from "@/Node/Element/Box";
import { Enter as EN } from "@/Node/SDNode/Enter";
import { effect } from "@/Node/SDNode/SDValue";
import { Factory } from "@/Utility/Factory";

export function Array(parent) {
    BaseArray.call(this, parent);

    this.type("Array");
    this.newLayer("elements");

    this.vars.merge({
        x: 0,
        y: 0,
        elementWidth: 40,
        elementHeight: 40
    });

    this._.updater = effect(() => {
        this.vars.elements.forEach((element, i) => {
            element.x(this.x() + i * this.elementWidth());
            element.y(this.y());
            element.width(this.elementWidth());
            element.height(this.elementHeight());
        });
    });
}

Array.prototype = {
    ...BaseArray.prototype
}

Array.prototype.elementWidth = Factory.handlerLowPrecise("elementWidth");
Array.prototype.elementHeight = Factory.handlerLowPrecise("elementHeight");
Array.prototype.width = function (width) {
    if (width === undefined) return this.elementWidth() * this.length();
    const length = this.length() ? this.length() : 1;
    this.elementWidth(width / length);
    return this;
}
Array.prototype.height = Array.prototype.elementHeight;

Array.prototype.insert = function (id, value) {
    const element = new Box(this.layer("elements")).opacity(0);
    element.value(value);
    element.onEnter(EN.appear("elements"));
    this.insertByBaseArray(id, element);
    return this;
}

Array.prototype.insertFromExistValue = function (id, value) {
    const element = new Box(this.layer("elements")).opacity(0);
    element.onEnter(EN.appear("elements"));
    this.insertByBaseArray(id, element);
    element.value(value.onEnter(EN.moveTo()));
    return this;
}

Array.prototype.insertFromExistElement = function (id, value) {
    const element = value;
    element.onEnter(EN.moveTo("elements"));
    this.insertByBaseArray(id, element);
    return this;
}
