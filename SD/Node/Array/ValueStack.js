import { Stack } from "@/Node/Array/Stack";
import { ValueArray } from "@/Node/Array/ValueArray";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

export class ValueStack extends Stack {
    constructor(target) {
        super(target);

        this.type("ValueStack");

        Check.validateArgumentsCountEqualTo(arguments, 1, `${this.constructor.name}.constructor`);

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

Object.assign(ValueStack.prototype, {
    align: Factory.handler("align"),
    justify: Factory.handler("justify"),
    insert: ValueArray.prototype.insert,
    insertFromExistValue: ValueArray.prototype.insertFromExistValue,
    insertFromExistElement: ValueArray.prototype.insertFromExistElement,
});
