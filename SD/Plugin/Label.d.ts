import { SDNode } from "@/Node/SDNode";
import { BaseText } from "@/Node/Text/BaseText";

class LabelPlugin {
    /**
     * Gets the target component of this label component.
     * @returns The target component.
     */
    target(): any;
    /**
     * Sets the target component of this label component.
     * @param target - The target component to apply.
     * @returns The current component instance for method chaining.
     */
    target(target: SDNode): this;
    /**
     * Gets the gap between this label component and its target component.
     * @returns The gap.
     */
    gap(): number;
    /**
     * Sets the gap between this label component and its target component.
     * @param gap - The gap to apply.
     * @returns The current component instance for method chaining.
     */
    gap(gap: number): this;
    /**
     * Gets the location of this label component relatives to its target component.
     * @returns The location.
     */
    location(): string;
    /**
     * Sets the location of this label component relatives to its target component. Default to `"lc"`.
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
     * @param location - The location to apply.
     * @returns The current component instance for method chaining.
     */
    location(location: string): this;
}

/**
 * Creates a **`sd.LabelPlugin`** instance.
 * @param target
 * @param text
 * @param location
 * @param fontSize
 * @param gap
 */
export function Label(target: SDNode, text: string, location?: string, fontSize?: number, gap?: number): LabelPlugin & BaseText;

/**
 * Creates a **`sd.LabelPlugin`** instance.
 * @param target
 * @param text
 * @param location
 * @param fontSize
 * @param gap
 */
export function MathjaxLabel(target: SDNode, text: string, location?: string, fontSize?: number, gap?: number): LabelPlugin & BaseText;
