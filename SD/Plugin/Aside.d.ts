import { SDNode } from "@/Node/SDNode";

class AsidePlugin {
    /**
     * Gets the gap between the aside component and its target component.
     * @returns The gap.
     */
    gap(): number;
    /**
     * Sets the gap between the aside component and its target component. Default to `5`.
     * @param gap The gap to apply.
     * @returns The current component instance for method chaining.
     */
    gap(gap: number): this;
    /**
     * Gets the location of the aside component relative to its target component.
     * @returns The location.
     */
    location(): string;
    /**
     * Sets the location of the aside component relative to its target component. Default to `"lc"`.
     * - "lt": left-top.
     * - "lc": left-center.
     * - "lb": left-bottom.
     * - "rt": right-top.
     * - "rc": right-center.
     * - "rb": right-bottom.
     * - "tl": top-left.
     * - "tc": top-center.
     * - "tr": top-right.
     * - "bl": bottom-left.
     * - "bc": bottom-center.
     * - "br": bottom-right.
     * @param location The location to apply.
     * @returns The current component instance for method chaining.
     */
    location(location: string): this;
}

/**
 * Creates a **`sd.AsidePlugin`** instance to position a component alongside another component with specified layout rules.
 *
 * This function extends the component named aside with plugin methods for configuring its position and spacing relative to the target component.
 * @param target
 * @param aside
 * @param location
 * @param gap
 */
export function Aside<T>(target: SDNode, aside: T, location: string, gap: number): T & AsidePlugin;
