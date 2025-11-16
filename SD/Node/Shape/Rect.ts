import { SDNode } from "@/Node/SDNode";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

export class Rect extends BaseShape {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.__createSVGNode("rect", {
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            rx: 0,
            ry: 0,
        });

        this.type("Rect");
    }
    rx(): number;
    rx(rx: number): this;
    rx(rx?: number) {
        if (arguments.length === 0) return this.vars.rx;
        Check.validateNumber(rx, `${this.constructor.name}.rx`);
        this.vars.lpset("rx", rx);
        return this;
    }
    ry(): number;
    ry(ry: number): this;
    ry(ry?: number) {
        if (arguments.length === 0) return this.vars.ry;
        Check.validateNumber(ry, `${this.constructor.name}.ry`);
        this.vars.lpset("ry", ry);
        return this;
    }
    borderRadius(radius) {
        return this.freeze().rx(radius).ry(radius).unfreeze();
    }
}
