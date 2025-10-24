import { Axis } from "@/Node/Axis/Axis";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class FixGapAxis extends Axis {
    constructor(target: SDNode | RenderNode) {
        super(target, { gap: 30 });

        this.type("FixGapAxis");

        delete this.vars.length;
    }

    length(): number;
    length(length: number): this;
    length(length?: number) {
        if (arguments.length === 0) return this.gap() * (this.tickCount() - 1);
        this.gap(length / (this.tickCount() - 1));
        return this;
    }

    gap(): number;
    gap(gap: number): this;
    gap(gap?: number) {
        if (arguments.length === 0) return this.vars.gap;
        this.vars.lpset("gap", gap);
        return this;
    }
}
