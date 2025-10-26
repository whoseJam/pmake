import { Context } from "@/Animate/Context";

class StressPlugin {
    /**
     * Applies a stress animation effect to the component.
     * @param scale - The scale factor for the stress effect. Defaults to `1.2`.
     * @returns The current component instance for method chaining.
     */
    stress(scale: number = 1.2): this {
        const self = this as any;
        const cx = self.cx();
        const cy = self.cy();
        const context = new Context(self);
        context.till(0, 0.5);
        self.scale(scale).cx(cx).cy(cy);
        context.till(0.5, 1);
        self.scale(1 / scale)
            .cx(cx)
            .cy(cy);
        context.recover();
        return this;
    }
}

/**
 * Creates a **`sd.StressPlugin`** instance.
 * @param target
 * @returns A new plugin instance.
 */
export function Stress<T>(target: T): StressPlugin & T {
    (target as any).stress = StressPlugin.prototype.stress;
    return target as StressPlugin & T;
}
