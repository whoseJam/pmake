import { BraceCurve } from "@/Node/Curve/BraceCurve";
import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";

type Location = "l" | "r" | "b" | "t";

export class BracePlugin extends BraceCurve {
    /**
     * Creates a brace around a region defined by two target components.
     * @param target1 - The first target component. If a number is provided:
     *                  1. The initial target must be an instance of `sd.BaseArray`.
     *                  2. The number will be treated as the index of the element in the array.
     * @param target2 - The second target component. Follows the same rules as target1.
     * @param location - Optional brace location (e.g., top, bottom). Defaults to `Location.AUTO`.
     * @param gap - Optional gap between the brace and targets. Defaults to the plugin's gap setting.
     * @returns The current plugin instance for method chaining.
     */
    brace(target1: number | SDNode, target2: number | SDNode, location?: Location, gap?: number): this;
    brace(target1: number | SDNode, target2: number | SDNode, location?: Location, gap?: number): this;
    location(): Location;
    location(location: Location): this;
    braceGap(): number;
    braceGap(gap: number): this;
    valueGap(): number;
    valueGap(gap: number): this;
    value(value: SDNode): this;
}

/**
 * Creates a **`sd.BracePlugin`** instance to brace a region.
 * @param target - The destination to render the plugin.
 * @returns A new plugin instance.
 */
export function Brace(target: SD2DNode | RenderNode): BracePlugin;
