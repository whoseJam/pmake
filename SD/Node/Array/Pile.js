import { Array } from "@/Node/Array/Array";
import { BaseArray } from "@/Node/Array/BaseArray";
import { Stack } from "@/Node/Array/Stack";
import { Check } from "@/Utility/Check";

export class Pile extends BaseArray {
    constructor(target) {
        super(target);

        this.type("Pile");

        this.vars.merge({
            x: 0,
            my: 0,
            elementWidth: 40,
            elementHeight: 40,
        });

        this.effect("array", () => {
            this.forEachElement((element, i) => {
                this.tryUpdate(element, () => {
                    element.width(this.elementWidth());
                    element.height(this.elementHeight());
                    element.x(this.x());
                    element.y(this.my() - (i + 1) * this.elementHeight());
                });
            });
        });
    }
}

Object.assign(Pile.prototype, {
    y(y) {
        if (arguments.length === 0) return this.my() - this.height();
        return this.my(y + this.height());
    },
    my(my) {
        if (arguments.length === 0) return this.vars.my;
        Check.validateNumber(my, `${this.constructor.name}.my`);
        this.vars.my = my;
        return this;
    },
    width(width) {
        if (arguments.length === 0) return this.elementWidth();
        return this.elementWidth(width);
    },
    height: Stack.prototype.height,
    insert: Array.prototype.insert,
    insertFromExistValue: Array.prototype.insertFromExistValue,
    insertFromExistElement: Array.prototype.insertFromExistElement,
    elementWidth: Array.prototype.elementWidth,
    elementHeight: Array.prototype.elementHeight,
});
