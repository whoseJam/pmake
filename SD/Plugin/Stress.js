import { Context } from "@/Animate/Context";

class StressPlugin {
    stress(scale = 1.2) {
        const cx = this.cx();
        const cy = this.cy();
        const context = new Context(this);
        context.till(0, 0.5);
        this.scale(scale).cx(cx).cy(cy);
        context.till(0.5, 1);
        this.scale(1 / scale)
            .cx(cx)
            .cy(cy);
        context.recover();
        return this;
    }
}

export function Stress(target) {
    target.stress = StressPlugin.prototype.stress;
    return target;
}
