import { Exit as EX } from "@/Node/Core/Exit";
import { Line } from "@/Node/Path/Line";
import { PathEngine } from "@/Node/Path/PathEngine";
import { SDNode } from "@/Node/SDNode";
import { trim } from "@/Utility/Trim";

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
    sourceElement(source?: SDNode): any | this {
        if (arguments.length === 0) return (this as any).vars.element1;
        (this as any).vars.element1.eraseChild((this as any).onExit(EX.nothing()));
        (this as any).vars.element1 = source;
        (this as any).vars.element1.childAs(this);
        return this;
    }
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
    targetElement(target?: SDNode): any | this {
        if (arguments.length === 0) return (this as any).vars.element2;
        (this as any).vars.element2.eraseChild((this as any).onExit(EX.nothing()));
        (this as any).vars.element2 = target;
        (this as any).vars.element2.childAs(this);
        return this;
    }
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
    sourceLocationX(location?: string): string | this {
        if (arguments.length === 0) return (this as any).vars.sx;
        (this as any).vars.sx = location;
        return this;
    }
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
    sourceLocationY(location?: string): string | this {
        if (arguments.length === 0) return (this as any).vars.sy;
        (this as any).vars.sy = location;
        return this;
    }
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
    targetLocationX(location?: string): string | this {
        if (arguments.length === 0) return (this as any).vars.tx;
        (this as any).vars.tx = location;
        return this;
    }
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
    targetLocationY(location?: string): string | this {
        if (arguments.length === 0) return (this as any).vars.ty;
        (this as any).vars.ty = location;
        return this;
    }
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
export function Link<T>(
    source: SDNode,
    target: SDNode,
    clazz: new (...args: any[]) => T = Line as any,
    sx: string = "cx",
    sy: string = "cy",
    tx: string = "cx",
    ty: string = "cy"
): LinkPlugin & T {
    const self = new clazz(target) as any;
    self.vars.merge({
        element1: source,
        element2: target,
        sx,
        sy,
        tx,
        ty,
    });

    self.sourceElement = LinkPlugin.prototype.sourceElement;
    self.targetElement = LinkPlugin.prototype.targetElement;
    self.sourceLocationX = LinkPlugin.prototype.sourceLocationX;
    self.sourceLocationY = LinkPlugin.prototype.sourceLocationY;
    self.targetLocationX = LinkPlugin.prototype.targetLocationX;
    self.targetLocationY = LinkPlugin.prototype.targetLocationY;

    const curve = self._.curve;
    if (curve) self.uneffect("curve");

    self.effect("link", () => {
        const element1 = self.vars.element1;
        const element2 = self.vars.element2;
        const source = [element1[self.sourceLocationX()](), element1[self.sourceLocationY()]()];
        const target = [element2[self.targetLocationX()](), element2[self.targetLocationY()]()];
        if (curve) {
            const d = curve(source, target);
            const [ps, pt] = PathEngine.trimPath(d, element1, element2);
            self.source(ps).target(pt).d(curve(ps, pt));
        } else {
            self.source(source).target(target);
            trim(self, element1, element2);
        }
    });

    source.childAs(self);
    target.childAs(self);

    return self as LinkPlugin & T;
}
