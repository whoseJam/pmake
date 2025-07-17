import { BaseCurve } from "@/Node/Curve/BaseCurve";

export class CircleCurve extends BaseCurve {
    /**
     * Gets the radius of this curve component.
     * @returns The radius.
     */
    r(): number;
    /**
     * Sets the radius of this curve component.
     * @param r - The radius to apply.
     * @returns The current component instance for method chaining.
     */
    r(r: number): this;
}
