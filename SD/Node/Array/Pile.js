import { Array } from "@/Node/Array/Array";
import { BaseArray } from "@/Node/Array/BaseArray";
import { effect } from "@/Node/SDNode/SDValue";
import { Factory } from "@/Utility/Factory";

export function Pile(parent) {
    BaseArray.call(this, parent);

    this.type("Pile");

    this.vars.merge({
        x: 0,
        my: 0,
        elementWidth: 40,
        elementHeight: 40
    });

    this._.updater = effect(() => {
        this.vars.elements.forEach((element, i) => {
            element.width(this.elementWidth());
            element.height(this.elementHeight());
            element.x(this.x());
            element.y(this.my() - (i + 1) * this.elementHeight());
        });
    });
}

Pile.prototype = {
    ...BaseArray.prototype
};

Pile.prototype.y = function (y) {
    if (y === undefined) return this.my() - this.height();
    this.my(y + this.height());
    return this;
}

Pile.prototype.my = Factory.handlerLowPrecise("my");
Pile.prototype.elementWidth = Factory.handlerLowPrecise("elementWidth");
Pile.prototype.elementHeight = Factory.handlerLowPrecise("elementHeight");
Pile.prototype.insert = Array.prototype.insert;
Pile.prototype.insertFromExistValue = Array.prototype.insertFromExistValue;
Pile.prototype.insertFromExistElement = Array.prototype.insertFromExistElement;
Pile.prototype.width = Pile.prototype.elementWidth;
Pile.prototype.height = function (height) {
    if (height === undefined) return this.elementHeight() * this.length();
    const length = Math.max(this.length(), 1);
    this.elementHeight(height / length);
    return this;
}
