import { Array } from "@/Node/Array/Array";
import { Enter as EN } from "@/Node/Core/Enter";
import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";

const ALIGN_KEY = new Set(["y", "cy", "my"]);
const ALIGN_KEY_SUGGESTION = [() => true, "For this component, here are 3 types of aligns which are 'y', 'cy', 'my'."];
const JUSTIFY_KEY = new Set(["x", "cx", "mx"]);
const JUSTIFY_KEY_SUGGESTION = [() => true, "For this component, here are 3 types of justifies which are 'x', 'cx', 'mx'."];

export class ValueArray extends Array {
    constructor(target) {
        super(target);

        this.type("ValueArray");

        this.vars.merge({
            align: "cy",
            justify: "cx",
        });

        this.uneffect("array");

        this.effect("array", () => {
            const align = this.align();
            const justify = this.justify();
            this.forEachElement((element, i) => {
                i = this.__idx(i);
                this.tryUpdate(element, () => {
                    if (justify === "x") element.x(this.x() + this.elementWidth() * i);
                    else if (justify === "cx") element.cx(this.x() + this.elementWidth() * (i + 0.5));
                    else element.mx(this.x() + this.elementWidth() * (i + 1));
                    element[align](this[align]());
                });
            });
        });
    }
}

Object.assign(ValueArray.prototype, {
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
    insert(id, value) {
        const element = Cast.castToSDNode(this.layer("elements"), value);
        element.onEnter(EN.appear("elements"));
        this.__insert(id, element);
        return this;
    },
    insertFromExistValue(id, value) {
        const element = value;
        element.onEnter(EN.moveTo("elements"));
        this.__insert(id, element);
        return this;
    },
});

ValueArray.prototype.insertFromExistElement = ValueArray.prototype.insertFromExistValue;
