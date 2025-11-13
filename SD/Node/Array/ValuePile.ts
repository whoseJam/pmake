import { Pile } from "@/Node/Array/Pile";
import { ValueArray } from "@/Node/Array/ValueArray";
import { ValueStack } from "@/Node/Array/ValueStack";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

type Align = "x" | "cx" | "mx";
type Justify = "y" | "cy" | "my";

export class ValuePile extends Pile<SDNode, SDNode> {
    constructor(target: SDNode | RenderNode) {
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
            this.forEachElement((element, i) => {
                i = this.__idx(i);
                this.tryUpdate(element, () => {
                    if (justify === "my") element.my(this.my() - this.elementHeight() * i);
                    else if (justify === "cy") element.cy(this.my() - this.elementHeight() * (i + 0.5));
                    else element.y(this.my() - this.elementHeight() * (i + 1));
                    element[align](this[align]());
                });
            });
        });
    }
    align(): Align;
    align(align: Align): this;
    align() {
        return ValueStack.prototype.align.apply(this, arguments);
    }
    justify(): Justify;
    justify(justify: Justify): this;
    justify() {
        return ValueStack.prototype.justify.apply(this, arguments);
    }
    insert(i: number, value: any) {
        return ValueArray.prototype.insert.apply(this, arguments);
    }
    insertFromExistValue(i: number, value: SDNode) {
        return ValueArray.prototype.insertFromExistValue.apply(this, arguments);
    }
    insertFromExistElement(i: number, value: SDNode) {
        return ValueArray.prototype.insertFromExistElement.apply(this, arguments);
    }
}
