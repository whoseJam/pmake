import { Context } from "@/Animate/Context";
import { BraceCurve } from "@/Node/Curve/BraceCurve";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Rule as R } from "@/Rule/Rule";
import { Check } from "@/Utility/Check";

type Location = "l" | "r" | "t" | "b";

const LOCATION_KEY = new Set(["l", "r", "t", "b"]);
const LOCATION_KEY_SUGGESTION = [
    () => true,
    "For brace component, here are 4 types of locations which are 'l', 'r', 't', 'b'.",
];

class BracePlugin {
    /**
     * Creates a brace around a region defined by two target components.
     *
     * - If a number is provided as the target, then the initialization target component must be an instance of `sd.BaseArray` and
     *   the number provided will be treated as the index of the target component in the array.
     * @param target1 - The first target component.
     * @param target2 - The second target component.
     * @param location - Optional brace location.
     * @param gap - Optional gap between the brace and targets.
     * @returns The current component instance for method chaining.
     */
    brace(target1: number | SDNode, target2: number | SDNode, location?: Location, gap?: number): this {
        let l: any = target1;
        let r: any = target2;
        if (Check.isNumber(l)) l = (this as any).vars.target.element(l);
        if (Check.isNumber(r)) r = (this as any).vars.target.element(r);
        if (arguments.length >= 3) (this as any).location(location);
        if (arguments.length >= 4) (this as any).braceGap(gap);
        if (!((this as any).vars.target instanceof SDNode)) replaceBrace(this as any, l, r);
        if ((this as any).duration() > 0 && (this as any).opacity() === 0) {
            const context = new Context(this as any);
            context.till(0, 0);
            (this as any).vars.setTogether({
                element1: l,
                element2: r,
            });
            context.till(0, 1);
            (this as any).opacity(1);
        } else {
            if ((this as any).opacity() === 0) (this as any).opacity(1);
            (this as any).vars.setTogether({
                element1: l,
                element2: r,
            });
        }
        return this;
    }
    /**
     * Gets the location of the brace component relative to its target components.
     * @returns The location.
     */
    location(): string;
    /**
     * Sets the location of the brace component relative to its target components. Defaults to `"t"`.
     * - "l": left.
     * - "r": right.
     * - "t": top.
     * - "b": bottom.
     * @param location - The location to apply.
     * @returns The current component instance for method chaining.
     */
    location(location: string): this;
    location(location?: string): string | this {
        if (arguments.length === 0) return (this as any).vars.location;
        Check.validateLocation(location!, LOCATION_KEY, "BracePlugin.location", 1, LOCATION_KEY_SUGGESTION);
        (this as any).vars.location = location;
        return this;
    }
    /**
     * Gets the gap between the brace component and its target components.
     * @returns The gap.
     */
    braceGap(): number;
    /**
     * Sets the gap between the brace component and its target components. Defaults to `5`.
     * @param gap - The gap to apply.
     * @returns The current component instance for method chaining.
     */
    braceGap(gap: number): this;
    braceGap(gap?: number): number | this {
        if (arguments.length === 0) return (this as any).vars.braceGap;
        Check.validateNumber(gap!, "BracePlugin.braceGap");
        (this as any).vars.lpset("braceGap", gap);
        return this;
    }
    /**
     * Gets the gap between the brace component and its value component.
     * @returns The gap.
     */
    valueGap(): number;
    /**
     * Sets the gap between the brace component and its value component. Defaults to `5`.
     * @param gap - The gap to apply.
     * @returns The current component instance for method chaining.
     */
    valueGap(gap: number): this;
    valueGap(gap?: number): number | this {
        if (arguments.length === 0) return (this as any).vars.valueGap;
        Check.validateNumber(gap!, "BracePlugin.valueGap");
        (this as any).vars.lpset("valueGap", gap);
        return this;
    }
}

/**
 * Creates a **`sd.BracePlugin`** instance to brace a region.
 * @param target - The destination to render the plugin.
 * @param location - The location of the brace component. Defaults to 't'.
 * @returns A new plugin instance.
 */
export function Brace(target: SDNode | RenderNode, location: string = "t"): BraceCurve & BracePlugin {
    Check.validateLocation(location, LOCATION_KEY, "Brace", 2, LOCATION_KEY_SUGGESTION);

    const self = new BraceCurve(target).opacity(0) as any;

    self.vars.merge({
        target,
        element1: undefined,
        element2: undefined,
        location,
        braceGap: 5,
        valueGap: 5,
    });

    self.value = BracePlugin.prototype.value;
    self.valueFromExist = BracePlugin.prototype.valueFromExist;
    self.brace = BracePlugin.prototype.brace;
    self.valueGap = BracePlugin.prototype.valueGap;
    self.braceGap = BracePlugin.prototype.braceGap;
    self.location = BracePlugin.prototype.location;

    self.effect("brace", () => {
        const element1 = self.vars.element1;
        const element2 = self.vars.element2;

        if (!element1 || !element2) return;
        const gap = self.braceGap();
        const location = self.location();
        if (location === "b" || location === "t") {
            const minx = Math.min(element1.x(), element2.x());
            const maxx = Math.max(element1.mx(), element2.mx());
            if (location === "b") {
                const maxy = Math.max(element1.my(), element2.my()) + gap;
                self.source(maxx, maxy);
                self.target(minx, maxy);
            } else {
                const miny = Math.min(element1.y(), element2.y()) - gap;
                self.source(minx, miny);
                self.target(maxx, miny);
            }
        } else if (location === "l" || location === "r") {
            const miny = Math.min(element1.y(), element2.y());
            const maxy = Math.max(element1.my(), element2.my());
            if (location === "l") {
                const minx = Math.min(element1.x(), element2.x()) - gap;
                self.source(minx, maxy);
                self.target(minx, miny);
            } else {
                const maxx = Math.max(element1.mx(), element2.mx()) + gap;
                self.source(maxx, miny);
                self.target(maxx, maxy);
            }
        }
    });

    if (target instanceof SDNode) target.childAs(self);

    return self as BraceCurve & BracePlugin;
}

function labelRule(parent: any, child: SDNode): void {
    const gap = parent.valueGap();
    const location = parent.location();
    if (location === "t") R.pointAtPathByRate(0.5, "cx", "my", 0, -gap)(parent, child);
    if (location === "b") R.pointAtPathByRate(0.5, "cx", "y", 0, gap)(parent, child);
    if (location === "l") R.pointAtPathByRate(0.5, "mx", "cy", -gap, 0)(parent, child);
    if (location === "r") R.pointAtPathByRate(0.5, "x", "cy", gap, 0)(parent, child);
}

function replaceBrace(self: any, l: SDNode, r: SDNode): void {
    if (self.vars.element1) self.vars.element1.eraseChild(self);
    if (self.vars.element2) self.vars.element2.eraseChild(self);
    l.childAs(self);
    r.childAs(self);
}
