import { BaseArray } from "@/Node/Array/BaseArray";
import { Box } from "@/Node/Element/Box";
import { SDNode } from "@/Node/SDNode";
import { Check } from "@/Utility/Check";

/**
 * Array component implementing the value-inside-element strategy.
 *
 * Render a uniform array where each element is a **`sd.Box`** instance.
 */
export class Array<E = Box, V = SDNode> extends BaseArray<E, V> {
    width(): number;
    width(width: number): this;
    width(width?: number) {
        if (arguments.length === 0) return this.elementWidth() * this.length();
        const length = Math.max(this.length(), 1);
        return this.elementWidth(width / length);
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        if (arguments.length === 0) return this.elementHeight();
        return this.elementHeight(height);
    }
    /**
     * Gets the element width of this array component.
     * @returns The uniform width of all array elements.
     */
    elementWidth(): number;
    /**
     * Sets the element width of this array component.
     * @param width - The uniform width of all array elements.
     * @returns The current component instance for method chainning.
     */
    elementWidth(width: number): this;
    elementWidth(width?: number) {
        if (arguments.length === 0) return this.vars.elementWidth;
        Check.validateNumber(width, `${this.constructor.name}.elementWidth`);
        this.vars.lpset("elementWidth", width);
        return this;
    }
    /**
     * Gets the element height of this array component.
     * @returns The uniform height of all array elements.
     */
    elementHeight(): number;
    /**
     * Sets the element height of this array component.
     * @param height - The uniform height of all array component.
     * @returns The current component instance for method chaining.
     */
    elementHeight(height: number): this;
    elementHeight(height?: number) {
        if (arguments.length === 0) return this.vars.elementHeight;
        Check.validateNumber(height, `${this.constructor.name}.elementHeight`);
        this.vars.lpset("elementHeight", height);
        return this;
    }
}
