import { Line } from "@/Node/Path/LineSVG";
import { SDNode } from "@/Node/SDNode";

export class PointerPlugin extends Line {
    /**
     * Gets the minimum gap between the adjacent pointers point to the same pointed component.
     * @returns The gap.
     */
    gap(): number;
    /**
     * Sets the minimum gap between the adjacent pointers point to the same pointed component.
     * @param gap - The gap to apply.
     * @returns The current component instance for method chaining.
     */
    gap(gap: number): this;
    /**
     * Gets the gap between the pointer component and its value component.
     * @returns The gap.
     */
    valueGap(): number;
    /**
     * Sets the gap between this pointer component and its value component. Default to `3`.
     * @param gap - The gap to apply.
     * @returns The current component instance for method chaining.
     */
    valueGap(gap: number): this;
    /**
     * Gets the gap between this pointer component and its value component.
     * @returns The gap.
     */
    pointerGap(): number;
    /**
     * Sets the gap between this pointer component and its value component.
     * @param gap - The gap to apply.
     * @returns The current component instance for method chaining.
     */
    pointerGap(gap: number): this;
    /**
     * Gets the length of this pointer component.
     * @returns The length.
     */
    length(): number;
    /**
     * Sets the length of this pointer component.
     * @param length - The length to apply.
     * @returns The current component instance for method chaining.
     */
    length(length: number): this;
    /**
     * Gets the direction of this pointer component.
     * @returns The direction.
     */
    direction(): string;
    /**
     * Sets the direction of this pointer component.
     * - "l": left.
     * - "r": right.
     * - "t": top.
     * - "b": bottom.
     * @param direction - The drection to apply.
     * @returns The current component instance for method chaining.
     */
    direction(direction: string): this;
    moveTo(): this;
    moveTo(i: number): this;
    moveTo(i: number, j: number): this;
    moveTo(at: SDNode): this;
    /**
     * Gets the component pointed by this pointer component.
     * @returns The pointed component, or undefined if no component is pointed by this pointer component.
     */
    pointElement(): any;
}

/**
 * Creates a **`sd.PointerPlugin`** instance.
 * @param target
 * @param label
 * @param direction
 * @param gap
 * @param length
 * @returns A new plugin instance.
 */
export function Pointer(target: SDNode, label?: string, direction?: string, gap?: number, length?: number): PointerPlugin;
