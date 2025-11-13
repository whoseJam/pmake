import { Exit as EX } from "@/Node/Core/Exit";
import { PathEngine } from "@/Node/Path/PathEngine";
import { SDNode } from "@/Node/SDNode";
import { trim } from "@/Utility/Trim";

type XLocation = "x" | "cx" | "mx";
type YLocation = "y" | "cy" | "my";

/**
 * Mixin that adds link functionality to any base class.
 * This mixin enables a component to act as a visual link between two SDNode elements,
 * automatically updating its position based on the source and target elements' locations.
 * @param Base - The base class to extend with link functionality.
 * @returns A new class that extends Base with LinkPlugin methods.
 */
export function LinkPluginMixin<TBase extends new (...args: any[]) => SDNode>(Base: TBase) {
    return class LinkPlugin extends Base {
        __postConstruct(): this {
            const self = this as any;
            const curve = self._.curve;
            if (curve) self.uneffect("curve");
            (this as any).effect("link", () => {
                const element1 = this.vars.sourceElement;
                const element2 = this.vars.targetElement;
                const source = [element1[this.sourceLocationX()](), element1[this.sourceLocationY()]()];
                const target = [element2[this.targetLocationX()](), element2[this.targetLocationY()]()];
                if (curve) {
                    const d = curve(source, target);
                    const [ps, pt] = PathEngine.trim(d, element1, element2);
                    self.source(ps).target(pt).d(curve(ps, pt));
                } else {
                    self.source(source).target(target);
                    trim(self, element1, element2);
                }
            });

            return this;
        }

        /**
         * Gets the source component of this link component.
         * @returns The source component.
         */
        sourceElement(): SDNode;
        /**
         * Sets the source component of this link component.
         * @param source - The source component.
         * @returns The current component instance for method chaining.
         */
        sourceElement(source: SDNode): this;
        sourceElement(source?: SDNode): SDNode | this {
            if (source === undefined) return this.vars.sourceElement;
            this.vars.sourceElement?.eraseChild(this.onExit(EX.nothing()));
            this.vars.sourceElement = source;
            this.vars.sourceElement.childAs(this);
            return this;
        }

        /**
         * Gets the target component of this link component.
         * @returns The target component.
         */
        targetElement(): SDNode;
        /**
         * Sets the target component of this link component.
         * @param target - The target component.
         * @returns The current component instance for method chaining.
         */
        targetElement(target: SDNode): this;
        targetElement(target?: SDNode): SDNode | this {
            if (target === undefined) return this.vars.targetElement;
            this.vars.targetElement?.eraseChild(this.onExit(EX.nothing()));
            this.vars.targetElement = target;
            this.vars.targetElement.childAs(this);
            return this;
        }

        /**
         * Gets the x coordinate property of the source component location for this link component.
         * @returns The x coordinate property of the source component location.
         */
        sourceLocationX(): XLocation;
        /**
         * Sets the x coordinate property of the source component location for this link component. Defaults to `"cx"`.
         * - "x": Uses the x coordinate of source component as the source point x coordinate.
         * - "cx": Uses the cx coordinate of source component as the source point x coordinate.
         * - "mx": Uses the mx coordinate of source component as the source point x coordinate.
         * @returns The current component instance for method chaining.
         */
        sourceLocationX(location: XLocation): this;
        sourceLocationX(location?: XLocation): XLocation | this {
            if (location === undefined) return this.vars.sx;
            this.vars.sx = location;
            return this;
        }

        /**
         * Gets the y coordinate property of the source component location for this link component.
         * @returns The y coordinate property of the source component location.
         */
        sourceLocationY(): YLocation;
        /**
         * Sets the y coordinate property of the source component location for this link component. Defaults to `"cy"`.
         * - "y": Uses the y coordinate of source component as the source point y coordinate.
         * - "cy": Uses the cy coordinate of source component as the source point y coordinate.
         * - "my": Uses the my coordinate of source component as the source point y coordinate.
         * @returns The current component instance for method chaining.
         */
        sourceLocationY(location: YLocation): this;
        sourceLocationY(location?: YLocation): YLocation | this {
            if (location === undefined) return this.vars.sy;
            this.vars.sy = location;
            return this;
        }

        /**
         * Gets the x coordinate property of the target component location for this link component.
         * @returns The x coordinate property of the target component location.
         */
        targetLocationX(): XLocation;
        /**
         * Sets the x coordinate property of the target component location for this link component. Defaults to `"cx"`.
         * - "x": Uses the x coordinate of target component as the target point x coordinate.
         * - "cx": Uses the cx coordinate of target component as the target point x coordinate.
         * - "mx": Uses the mx coordinate of target component as the target point x coordinate.
         * @returns The current component instance for method chaining.
         */
        targetLocationX(location: XLocation): this;
        targetLocationX(location?: XLocation): XLocation | this {
            if (location === undefined) return this.vars.tx;
            this.vars.tx = location;
            return this;
        }

        /**
         * Gets the y coordinate property of the target component location for this link component.
         * @returns The y coordinate property of the target component location.
         */
        targetLocationY(): YLocation;
        /**
         * Sets the y coordinate property of the target component location for this link component. Defaults to `"cy"`.
         * - "y": Uses the y coordinate of target component as the target point y coordinate.
         * - "cy": Uses the cy coordinate of target component as the target point y coordinate.
         * - "my": Uses the my coordinate of target component as the target point y coordinate.
         * @returns The current component instance for method chaining.
         */
        targetLocationY(location: YLocation): this;
        targetLocationY(location?: YLocation): YLocation | this {
            if (location === undefined) return this.vars.ty;
            this.vars.ty = location;
            return this;
        }
    };
}
