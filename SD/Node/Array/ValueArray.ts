import { Array } from "@/Node/Array/Array";
import { Enter as EN } from "@/Node/Core/Enter";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

const ALIGN_KEY = new Set(["y", "cy", "my"]);
const ALIGN_KEY_SUGGESTION = [() => true, "For this component, here are 3 types of aligns which are 'y', 'cy', 'my'."];
const JUSTIFY_KEY = new Set(["x", "cx", "mx"]);
const JUSTIFY_KEY_SUGGESTION = [
    () => true,
    "For this component, here are 3 types of justifies which are 'x', 'cx', 'mx'.",
];

type Align = "y" | "cy" | "my";
type Justify = "x" | "cx" | "mx";

export class ValueArray extends Array<SDNode, SDNode> {
    constructor(target: SDNode | RenderNode) {
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
    insert(i: number, value: any) {
        const element = SDNode.__asNode(this, value);
        element.onEnter(EN.appear("elements"));
        return this.__insert(i, element);
    }
    insertFromExistValue(i: number, value: SDNode) {
        const element = value;
        element.onEnter(EN.moveTo("elements"));
        return this.__insert(i, element);
    }
    insertFromExistElement(i: number, value: SDNode) {
        return this.insertFromExistValue(i, value);
    }
}
