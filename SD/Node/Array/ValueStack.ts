import { Stack } from "@/Node/Array/Stack";
import { ValueArray } from "@/Node/Array/ValueArray";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

const ALIGN_KEY = new Set(["x", "cx", "mx"]);
const ALIGN_KEY_SUGGESTION = [() => true, "For this component, here are 3 types of aligns which are 'x', 'cx', 'mx'."];
const JUSTIFY_KEY = new Set(["y", "cy", "my"]);
const JUSTIFY_KEY_SUGGESTION = [() => true, "For this component, here are 3 types of justifies which are 'y', 'cy', 'my'."];

type Align = "x" | "cx" | "mx";
type Justify = "y" | "cy" | "my";

export class ValueStack extends Stack {
    constructor(target: SDNode | RenderNode) {
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
    align(): Align;
    align(align: Align): this;
    align(align?: Align) {
        if (arguments.length === 0) return this.vars.align;
        Check.validateAlign(align, ALIGN_KEY, `${this.constructor.name}.align`, 1, ALIGN_KEY_SUGGESTION);
        this.vars.align = align;
        return this;
    }
    justify(): Justify;
    justify(justify: Justify): this;
    justify(justify?: Justify) {
        if (arguments.length === 0) return this.vars.justify;
        Check.validateJustify(justify, JUSTIFY_KEY, `${this.constructor.name}.justify`, 1, JUSTIFY_KEY_SUGGESTION);
        this.vars.justify = justify;
        return this;
    }
    insert(i: number, value: any): this {
        return ValueArray.prototype.insert.apply(this, arguments);
    }
    insertFromExistValue(i: number, value: SDNode): this {
        return ValueArray.prototype.insertFromExistValue.apply(this, arguments);
    }
    insertFromExistElement(i: number, value: SDNode): this {
        return ValueArray.prototype.insertFromExistElement.apply(this, arguments);
    }
}
