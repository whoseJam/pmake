import { BraceCurve } from "@/Node/Curve/BraceCurve";
import { SDNode } from "@/Node/SDNode";

export class BracePlugin extends BraceCurve {
    /**
     * Creates a brace around a region defined by two target components.
     *
     * - If a number is provided as the target, then the initialization target component must be an instance of `sd.BaseArray` and
     *   the number provided will be treated as the index of the target component in the array.
     * @param target1 - The first target component.
     * @param target2 - The second target component.
     * @param location - Optional brace location.
     * @param gap - Optional gap between the brace and targets.
     * @returns The current component instance for method chaining.
     */
    brace(target1: number | SDNode, target2: number | SDNode, location?: "l" | "r" | "b" | "t", gap?: number): this;
    /**
     * Gets the location of the brace component relative to its target components.
     * @returns The location.
     */
    location(): "l" | "r" | "t" | "b";
    /**
     * Sets the location of the brace component relative to its target components. Default to `"t"`.
     * - "l": left.
     * - "r": right.
     * - "t": top.
     * - "b": bottom.
     * @param location The location to apply.
     * @returns The current component instance for method chaining.
     */
    location(location: "l" | "r" | "t" | "b"): this;
    /**
     * Gets the gap between the brace component and its target components.
     * @returns The gap.
     */
    braceGap(): number;
    /**
     * Sets the gap between the brace component and its target components. Default to `5`.
     * @param gap The gap to apply.
     * @returns The current component instance for method chaining.
     */
    braceGap(gap: number): this;
    /**
     * Gets the gap between the brace component and its value component.
     * @returns The gap.
     */
    valueGap(): number;
    /**
     * Sets the gap between the brace component and its value component. Default to `5`.
     * @param gap The gap to apply.
     * @returns The current component instance for method chaining.
     */
    valueGap(gap: number): this;
}

/**
 * Creates a **`sd.BracePlugin`** instance to brace a region.
 * @param target - The destination to render the plugin.
 * @param location - The location of the brace component. Default to 't'.
 * @returns A new plugin instance.
 */
export function Brace(target: SDNode | RenderNode, location?: "l" | "r" | "t" | "b"): BracePlugin;
