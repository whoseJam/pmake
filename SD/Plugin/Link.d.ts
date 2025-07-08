import { SDNode } from "@/Node/SDNode";

type XLocation = "x" | "cx" | "mx";
type YLocation = "y" | "cy" | "my";

class LinkPlugin {
    /**
     * Gets the source component of this link component.
     * @returns The source component.
     */
    sourceElement(): any;
    /**
     * Sets the source component of this link component.
     * @param source - The source component.
     * @returns The current component instance for method chaining.
     */
    sourceElement(source: SDNode): this;
    /**
     * Gets the target component of this link component.
     * @returns The target component.
     */
    targetElement(): any;
    /**
     * Sets the target component of this link component.
     * @param target - The target component.
     * @returns The current component instance for method chaining.
     */
    targetElement(target: SDNode): this;
    /**
     * Gets the x coordinate property of the source component location for this link component.
     * @returns The x coordinate property of the source component location.
     */
    sourceLocationX(): string;
    /**
     * Sets the x coordinate property of the source component location for this link component. Defaults to `"cx"`.
     * - "x": Uses the x coordinate of source component as the source point x coordinate.
     * - "cx": Uses the cx coordinate of source component as the source point x coordinate.
     * - "mx": Uses the mx coordinate of source component as the source point x coordinate.
     * @returns The current component instance for method chaining.
     */
    sourceLocationX(location: string): this;
    /**
     * Gets the y coordinate property of the source component location for this link component.
     * @returns The y coordinate property of the source component location.
     */
    sourceLocationY(): string;
    /**
     * Sets the y coordinate property of the source component location for this link component. Defaults to `"cy"`.
     * - "y": Uses the y coordinate of source component as the source point y coordinate.
     * - "cy": Uses the cy coordinate of source component as the source point y coordinate.
     * - "my": Uses the my coordinate of source component as the source point y coordinate.
     * @returns The current component instance for method chaining.
     */
    sourceLocationY(location: string): this;
    /**
     * Gets the x coordinate property of the target component location for this link component.
     * @returns The x coordinate property of the target component location.
     */
    targetLocationX(): string;
    /**
     * Sets the x coordinate property of the target component location for this link component. Defaults to `"cx"`.
     * - "x": Uses the x coordinate of target component as the target point x coordinate.
     * - "cx": Uses the cx coordinate of target component as the target point x coordinate.
     * - "mx": Uses the mx coordinate of target component as the target point x coordinate.
     * @returns The current component instance for method chaining.
     */
    targetLocationX(location: string): this;
    /**
     * Gets the y coordinate property of the target component location for this link component.
     * @returns The y coordinate property of the target component location.
     */
    targetLocationY(): string;
    /**
     * Sets the y coordinate property of the target component location for this link component. Defaults to `"cy"`.
     * - "y": Uses the y coordinate of target component as the target point y coordinate.
     * - "cy": Uses the cy coordinate of target component as the target point y coordinate.
     * - "my": Uses the my coordinate of target component as the target point y coordinate.
     * @returns The current component instance for method chaining.
     */
    targetLocationY(location: string): this;
}

/**
 * Creates a **`sd.LinkPlugin`** instance.
 * @param source
 * @param target
 * @param clazz
 * @param sx
 * @param sy
 * @param tx
 * @param ty
 * @returns A new plugin instance.
 */
export function Link<T>(source: SDNode, target: SDNode, clazz: new (...args: any[]) => T, sx: string, sy: string, tx: string, ty: string): LinkPlugin & T;
