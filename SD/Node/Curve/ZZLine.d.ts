import { BaseCurve } from "@/Node/Curve/BaseCurve";

export class ZZLine extends BaseCurve {
    /**
     * Gets the bending of this curve component.
     * @returns The bending.
     */
    bending(): number;
    /**
     * Sets the bending of this curve component. Defaults to `0.25`.
     * @param bending - The bending to apply.
     * @returns The current component instance for method chaining.
     */
    bending(bending: number): this;
    /**
     * Gets the location of this curve component.
     * @returns The location.
     */
    location(): string;
    /**
     * Sets the location of this curve component. Defaults to `"b"`.
     * @param location - The location to apply.
     * @returns The current component instance for method chaining.
     */
    location(location: string): this;
}
