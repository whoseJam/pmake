import { Array } from "@/Node/Array/Array";
import { BaseArray } from "@/Node/Array/BaseArray";
import { effect } from "@/Node/SDNode/SDValue";
import { Factory } from "@/Utility/Factory";

export function Stack(parent) {
    BaseArray.call(this, parent);

    this.type("Stack");
    this.newLayer("elements");

    this.vars.merge({
        x: 0,
        y: 0,
        elementWidth: 40,
        elementHeight: 40
    });

    this._.updater = effect(() => {
        this.vars.elements.forEach((element, i) => {
            element.width(this.elementWidth());
            element.height(this.elementHeight());
            element.x(this.x());
            element.y(this.y() + i * this.elementHeight());
        });
    });
}

Stack.prototype = {
    ...BaseArray.prototype
};

Stack.prototype.elementWidth = Factory.handlerLowPrecise("elementWidth");
Stack.prototype.elementHeight = Factory.handlerLowPrecise("elementHeight");
Stack.prototype.insert = Array.prototype.insert;
Stack.prototype.insertFromExistValue = Array.prototype.insertFromExistValue;
Stack.prototype.insertFromExistElement = Array.prototype.insertFromExistElement;
Stack.prototype.width = Stack.prototype.elementWidth;
Stack.prototype.height = function (height) {
    if (height === undefined) return this.elementHeight() * this.length();
    const length = Math.max(this.length(), 1);
    this.elementHeight(height / length);
    return this;
}
