import { Stack } from "@/Node/Array/Stack";
import { ValueArray } from "@/Node/Array/ValueArray";
import { Check } from "@/Utility/Check";

const ALIGN_KEY = new Set(["x", "cx", "mx"]);
const ALIGN_KEY_SUGGESTION = [() => true, "For this component, here are 3 types of aligns which are 'x', 'cx', 'mx'."];
const JUSTIFY_KEY = ["y", "cy", "my"];
const JUSTIFY_KEY_SUGGESTION = [() => true, "For this component, here are 3 types of justifies which are 'y', 'cy', 'my'."];

export class ValueStack extends Stack {
    constructor(target) {
        super(target);

        this.type("ValueStack");

        this.vars.merge({
            align: "cx",
            justify: "cy",
        });

        this.uneffect("array");

        this.effect("array", () => {
            const align = this.align();
            const justify = this.justify();
            this.forEachElement((element, i) => {
                i = this.__idx(i);
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
    align(align) {
        if (arguments.length === 0) return this.vars.align;
        Check.validateAlign(align, ALIGN_KEY, `${this.constructor.name}.align`, ALIGN_KEY_SUGGESTION);
        this.vars.align = align;
        return this;
    },
    justify(justify) {
        if (arguments.length === 0) return this.vars.justify;
        Check.validateJustify(justify, JUSTIFY_KEY, `${this.constructor.name}.justify`, JUSTIFY_KEY_SUGGESTION);
        this.vars.justify = justify;
        return this;
    },
    insert: ValueArray.prototype.insert,
    insertFromExistValue: ValueArray.prototype.insertFromExistValue,
    insertFromExistElement: ValueArray.prototype.insertFromExistElement,
});
