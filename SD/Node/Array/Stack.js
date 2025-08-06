import { Array } from "@/Node/Array/Array";
import { BaseArray } from "@/Node/Array/BaseArray";

export class Stack extends BaseArray {
    constructor(target) {
        super(target);

        this.type("Stack");

        this.vars.merge({
            x: 0,
            y: 0,
            elementWidth: 40,
            elementHeight: 40,
        });

        this.effect("array", () => {
            this.forEachElement((element, i) => {
                i = this.__idx(i);
                this.tryUpdate(element, () => {
                    element.width(this.elementWidth());
                    element.height(this.elementHeight());
                    element.x(this.x());
                    element.y(this.y() + i * this.elementHeight());
                });
            });
        });
    }
}

Object.assign(Stack.prototype, {
    height(height) {
        if (arguments.length === 0) return this.elementHeight() * this.length();
        const length = Math.max(this.length(), 1);
        return this.elementHeight(height / length);
    },
    insert: Array.prototype.insert,
    insertFromExistValue: Array.prototype.insertFromExistValue,
    insertFromExistElement: Array.prototype.insertFromExistElement,
    elementWidth: Array.prototype.elementWidth,
    elementHeight: Array.prototype.elementHeight,
});

Stack.prototype.width = Stack.prototype.elementWidth;
