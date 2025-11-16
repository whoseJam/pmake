import { Context } from "@/Animate/Context";
import { BaseGrid } from "@/Node/Grid/BaseGrid";
import { SDNode } from "@/Node/SDNode";
import { Check } from "@/Utility/Check";

/**
 * Mixin that adds focus functionality to any base class.
 * This mixin enables a component to highlight specific regions or elements
 * by automatically adjusting its position and size based on target elements.
 * @param Base - The base class to extend with focus functionality.
 * @returns A new class that extends Base with focus methods.
 */
export function FocusPluginMixin<TBase extends new (...args: any[]) => any>(Base: TBase) {
    return class extends Base {
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
            if (arguments.length === 0) return this.vars.gap;
            Check.validateNumber(gap!, `${this.constructor.name}.gap`);
            this.vars.lpset("gap", gap);
            return this;
        }

        /**
         * Sets focus on the initialization target component.
         * @returns The current component instance for method chaining.
         */
        focus(): this;
        /**
         * Sets focus on a specific element within the initialization target component.
         * - Throws an error if the initialization target component is not an instance of `sd.BaseArray`, `sd.BaseTree` or `sd.BaseGraph`.
         * @param i - The index of the specific element.
         * @returns The current component instance for method chaining.
         */
        focus(i: number): this;
        /**
         * Sets focus on a range of elements within the initialization target component.
         * - Throws an error if the initialization target component is not an instance of `sd.BaseArray`.
         * @param l - The left index of the range.
         * @param r - The right index of the range.
         * @returns The current component instance for method chaining.
         */
        focus(l: number, r: number): this;
        /**
         * Sets focus on a specific element within the initialization target component.
         * - Throws an error if the initialization target component is not an instance of `sd.BaseGrid`.
         * @param i - The index along the primary dimension.
         * @param j - The index along the secondary dimension.
         * @returns The current component instance for method chaining.
         */
        focus(i: number, j: number): this;
        /**
         * Sets focus on a region of elements within the initialization target component.
         * - Throws an error if the initialization target component is not an instance of `sd.BaseGrid`.
         * @param i1 - The first index along the primary dimension.
         * @param j1 - The first index along the secondary dimension.
         * @param i2 - The second index along the primary dimension.
         * @param j2 - The second index along the secondary dimension.
         * @returns The current component instance for method chaining.
         */
        focus(i1: number, j1: number, i2: number, j2: number): this;
        /**
         * Sets focus on the target component.
         * @param target - The target component.
         * @returns The current component instance for method chaining.
         */
        focus(target: SDNode): this;
        /**
         * Sets focus on a region defined by two target components.
         * @param target1 - The first component defining the focus region.
         * @param target2 - The second component defining the focus region.
         * @returns The current component instance for method chaining.
         */
        focus(target1: SDNode, target2: SDNode): this;
        /**
         * Removes the current focus region.
         * @param cancel - Pass null or undefined to remove focus.
         * @returns The current component instance for method chaining.
         */
        focus(cancel: null | undefined): this;
        focus(a?: any, b?: any, c?: any, d?: any): this {
            if (arguments.length === 0) return this.focus(this.vars.target, this.vars.target);
            else if (arguments.length === 1) {
                if (Check.isEmpty(a)) return this.__hideFocus();
                if (!(a instanceof SDNode)) a = this.vars.target.element(a);
                return this.focus(a, a);
            } else if (arguments.length === 2) {
                if (this.vars.target instanceof BaseGrid) {
                    if (Check.isNumber(a) && Check.isNumber(b)) {
                        a = this.vars.target.element(a, b);
                        return this.focus(a, a);
                    }
                } else {
                    if (Check.isNumber(a) || Check.isNumber(b)) {
                        if (Check.isNumber(a)) a = this.vars.target.element(a);
                        if (Check.isNumber(b)) b = this.vars.target.element(b);
                        return this.focus(a, b);
                    }
                }
            } else if (arguments.length === 4) {
                a = this.vars.target.element(a, b);
                b = this.vars.target.element(c, d);
                return this.focus(a, b);
            }
            return this.__showFocus(a, b);
        }

        __hideFocus(): this {
            this.vars.setTogether({
                element1: undefined,
                element2: undefined,
            });
            return this.opacity(0);
        }

        __showFocus(element1: SDNode, element2: SDNode): this {
            const shouldAnimate = this.duration() > 0 && this.opacity() === 0;

            if (shouldAnimate) {
                const context = new Context(this);
                context.till(0, 0);
                this.vars.setTogether({
                    element1,
                    element2,
                });
                context.till(0, 1);
                this.opacity(1);
            } else {
                if (this.opacity() === 0) this.opacity(1);
                this.vars.setTogether({
                    element1,
                    element2,
                });
            }

            return this;
        }
    };
}
