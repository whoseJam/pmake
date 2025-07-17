import { BaseCurve } from "@/Node/Curve/BaseCurve";

export class BraceCurve extends BaseCurve {
    /**
     * Gets the bending of this curve component.
     * @returns The bending.
     */
    bending(): number;
    /**
     * Sets the bending of this curve component. Defaults to `5`.
     * @param bending - The bending to apply.
     * @returns The current component instance for method chaining.
     */
    bending(bending: number): this;
}
