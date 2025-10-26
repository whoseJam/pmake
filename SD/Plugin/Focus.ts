import { Context } from "@/Animate/Context";
import { BaseGrid } from "@/Node/Grid/BaseGrid";
import { SDNode } from "@/Node/SDNode";
import { Rect } from "@/Node/Shape/Rect";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";

class FocusPlugin {
    /**
     * Gets the gap between the focus component and its target components.
     * @returns The gap.
     */
    gap(): number;
    /**
     * Sets the gap between the focus component and its target components. Defaults to `0`.
     * @param gap - The gap to apply.
     * @returns The current component instance for method chaining.
     */
    gap(gap: number): this;
    gap(gap?: number): number | this {
        if (arguments.length === 0) return (this as any).vars.gap;
        Check.validateNumber(gap!, "FocusPlugin.gap");
        (this as any).vars.lpset("gap", gap);
        return this;
    }
    /**
     * Sets focus on the initialization target component.
     * @returns The current component instance for method chaining.
     */
    /**
     * Sets focus on a specific element within the initialization target component.
     * - Throws an error if the initialization target component is not an instance of `sd.BaseArray`, `sd.BaseTree` or `sd.BaseGraph`.
     * @param i - The index of the specific element.
     * @returns The current component instance for method chaining.
     */
    /**
     * Sets focus on a range of elements within the initialization target component.
     * - Throws an error if the initialization target component is not an instance of `sd.BaseArray`.
     * @param l - The left index of the range.
     * @param r - The right index of the range.
     * @returns The current component instance for method chaining.
     */
    /**
     * Sets focus on a specific element within the initialization target component.
     * - Throws an error if the initialization target component is not an instance of `sd.BaseGrid`.
     * @param i - The index along the primary dimension.
     * @param j - The index along the secondary dimension.
     * @returns The current component instance for method chaining.
     */
    /**
     * Sets focus on a region of elements within the initialization target component.
     * - Throws an error if the initialization target component is not an instance of `sd.BaseGrid`.
     * @param i1
     * @param j1
     * @param i2
     * @param j2
     * @returns The current component instance for method chaining.
     */
    /**
     * Sets focus on the target component.
     * @param target
     * @returns The current component instance for method chaining.
     */
    /**
     * Sets focus on a region defined by two target components.
     * @param target1 - The first component defining the focus region.
     * @param target2 - The second component defining the focus region.
     * @returns The current component instance for method chaining.
     */
    /**
     * Removes the current focus region.
     * @param cancel
     * @returns The current component instance for method chaining.
     */
    focus(a?: any, b?: any, c?: any, d?: any): this {
        const self = this as any;
        if (arguments.length === 0) return this.focus(self.vars.target, self.vars.target);
        else if (arguments.length === 1) {
            if (Check.isEmpty(a)) return this.focus(null, null);
            if (!(a instanceof SDNode)) a = self.vars.target.element(a);
            return this.focus(a, a);
        } else if (arguments.length === 2) {
            if (self.vars.target instanceof BaseGrid) {
                if (Check.isNumber(a) && Check.isNumber(b)) {
                    a = self.vars.target.element(a, b);
                    return this.focus(a, a);
                }
            } else {
                if (Check.isNumber(a) || Check.isNumber(b)) {
                    if (Check.isNumber(a)) a = self.vars.target.element(a);
                    if (Check.isNumber(b)) b = self.vars.target.element(b);
                    return this.focus(a, b);
                }
            }
        } else if (arguments.length === 4) {
            a = self.vars.target.element(a, b);
            b = self.vars.target.element(c, d);
            return this.focus(a, b);
        }
        if (Check.isEmpty(a)) {
            self.vars.setTogether({
                element1: undefined,
                element2: undefined,
            });
            return self.opacity(0);
        }
        if (self.duration() > 0 && self.opacity() === 0) {
            const context = new Context(self);
            context.till(0, 0);
            self.vars.setTogether({
                element1: a,
                element2: b,
            });
            context.till(0, 1);
            self.opacity(1);
        } else {
            if (self.opacity() === 0) self.opacity(1);
            self.vars.setTogether({
                element1: a,
                element2: b,
            });
        }
        return this;
    }
}

/**
 * Creates a **`sd.FocusPlugin`** instance to highlight a region.
 * @param target
 * @returns A new plugin instance.
 */
export function Focus(target: SDNode | RenderNode): Rect & FocusPlugin {
    const self = new Rect(target).opacity(0).fillOpacity(0).stroke(C.red).strokeWidth(3) as any;
    self.vars.merge({
        target,
        element1: undefined,
        element2: undefined,
        gap: 0,
    });
    self.gap = FocusPlugin.prototype.gap;
    self.focus = FocusPlugin.prototype.focus;

    self.effect("focus", () => {
        const element1 = self.vars.element1;
        const element2 = self.vars.element2;
        if (!element1 || !element2) return;
        const x = Math.min(element1.x(), element2.x());
        const mx = Math.max(element1.mx(), element2.mx());
        const y = Math.min(element1.y(), element2.y());
        const my = Math.max(element1.my(), element2.my());
        const gap = self.gap();
        self.x(x - gap).y(y - gap);
        self.width(mx - x + gap * 2);
        self.height(my - y + gap * 2);
    });
    if (target instanceof SDNode) target.childAs(self);
    return self as Rect & FocusPlugin;
}
