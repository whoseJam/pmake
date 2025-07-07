import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";

class IndexPlugin extends SD2DNode {
    /**
     * Gets the target component of this index component.
     * @returns The target component.
     */
    target(): any;
    /**
     * Sets the target component of this index component.
     * @param target - The target component to apply.
     * @returns The current component instance for method chaining.
     */
    target(target: SDNode): this;
    /**
     * Gets the gap between this index component and its target component.
     * @returns The gap.
     */
    gap(): number;
    /**
     * Sets the gap between this index component and its target component. Default to `3`.
     * @param gap - The gap to apply.
     * @returns The current component instance for method chaining.
     */
    gap(gap: number): this;
    /**
     * Gets the location of this index component relative to its target component.
     * @returns The location.
     */
    location(): string;
    /**
     * Sets the location of this index component relative to its target component. Default to `"t"`.
     * - "l": left.
     * - "r": right.
     * - "t": top.
     * - "b": bottom.
     * @param location - The location to apply.
     * @returns The current component instance for method chaining.
     */
    location(location: string): this;
    /**
     * Gets the font size of this index component.
     * @returns The font size.
     */
    fontSize(): number;
    /**
     * Sets the font size of this index component. Default to `15`.
     * @param fontSize - The font size to apply.
     * @returns The current component instance for method chaining.
     */
    fontSize(fontSize: number): this;
}

/**
 * Creates a **`sd.IndexPlugin`** instance.
 * @param target
 * @param location
 * @param fontSize
 * @param gap
 */
export function Index(target: SDNode, location?: string, fontSize?: number, gap?: number): IndexPlugin;
