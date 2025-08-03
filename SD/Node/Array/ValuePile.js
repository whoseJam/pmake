import { Pile } from "@/Node/Array/Pile";
import { ValueArray } from "@/Node/Array/ValueArray";
import { ValueStack } from "@/Node/Array/ValueStack";

export class ValuePile extends Pile {
    constructor(target) {
        super(target);

        this.type("ValuePile");

        this.vars.merge({
            align: "cx",
            justify: "cy",
        });

        this.uneffect("array");

        this.effect("array", () => {
            const align = this.align();
            const justify = this.justify();
            this.vars.elements.forEach((element, i) => {
                this.tryUpdate(element, () => {
                    if (justify === "y") element.y(this.y() + this.elementHeight() * i);
                    else if (justify === "cy") element.cy(this.y() + this.elementHeight() * (i + 0.5));
                    else element.my(this.y() + this.elementHeight() * (i + 1));
                    element[align](this[align]());
                });
            });
        });
    }
}

Object.assign(ValuePile.prototype, {
    align: ValueStack.prototype.align,
    justify: ValueStack.prototype.justify,
    insert: ValueArray.prototype.insert,
    insertFromExistValue: ValueArray.prototype.insertFromExistValue,
    insertFromExistElement: ValueArray.prototype.insertFromExistElement,
});
