import { Context } from "../Animate/Context";

export function Stress(node) {
    node.stress = function(rate = 1.2) {
        let cx = this.cx();
        let cy = this.cy();
        let width = this.width();
        let context = new Context(this);
        context.till(0, 0.5);
        this.width(width * rate);
        this.cx(cx).cy(cy);

        context.till(0.5, 1);
        this.width(width);
        this.cx(cx).cy(cy);
        context.recover();
        return this;
    }
    return node;
}