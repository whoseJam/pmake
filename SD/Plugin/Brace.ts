import { Context } from "@/Animate/Context";
import { BraceCurve } from "@/Node/Curve/BraceCurve";
import { ValueManageMixin } from "@/Node/Mixin/ValueManageMixin";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

type Location = "l" | "r" | "t" | "b";

const LOCATION_KEY = new Set(["l", "r", "t", "b"]);
const LOCATION_KEY_SUGGESTION = [
    () => true,
    "For brace component, here are 4 types of locations which are 'l', 'r', 't', 'b'.",
];

class BracePlugin extends ValueManageMixin(BraceCurve) {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.opacity(0);

        this.vars.merge({
            target,
            sourceElement: undefined,
            targetElement: undefined,
            location,
            braceGap: 5,
            valueGap: 5,
        });

        this.type("Brace");

        if (target instanceof SDNode) target.childAs(this);

        this.effect("brace", () => {
            const sourceElement = this.vars.sourceElement;
            const targetElement = this.vars.targetElement;

            if (!sourceElement || !targetElement) return;
            const gap = this.braceGap();
            const location = this.location();
            if (location === "b" || location === "t") {
                const minx = Math.min(sourceElement.x(), targetElement.x());
                const maxx = Math.max(sourceElement.mx(), targetElement.mx());
                if (location === "b") {
                    const maxy = Math.max(sourceElement.my(), targetElement.my()) + gap;
                    this.source(maxx, maxy);
                    this.target(minx, maxy);
                } else {
                    const miny = Math.min(sourceElement.y(), targetElement.y()) - gap;
                    this.source(minx, miny);
                    this.target(maxx, miny);
                }
            } else if (location === "l" || location === "r") {
                const miny = Math.min(sourceElement.y(), targetElement.y());
                const maxy = Math.max(sourceElement.my(), targetElement.my());
                if (location === "l") {
                    const minx = Math.min(sourceElement.x(), targetElement.x()) - gap;
                    this.source(minx, maxy);
                    this.target(minx, miny);
                } else {
                    const maxx = Math.max(sourceElement.mx(), targetElement.mx()) + gap;
                    this.source(maxx, miny);
                    this.target(maxx, maxy);
                }
            }
        });
    }

    __defaultValueRule() {
        return (parent: BracePlugin, child: SDNode) => {
            const gap = parent.valueGap();
            const location = parent.location();
            if (location === "t") child.cx(parent.cx()).my(parent.y() - gap);
            if (location === "b") child.cx(parent.cx()).y(parent.my() + gap);
            if (location === "l") child.mx(parent.x() - gap).cy(parent.cy());
            if (location === "r") child.x(parent.mx() + gap).cy(parent.cy());
        };
    }

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
        if (Check.isNumber(l)) l = this.vars.target.element(l);
        if (Check.isNumber(r)) r = this.vars.target.element(r);
        if (arguments.length >= 3) this.location(location);
        if (arguments.length >= 4) this.braceGap(gap);
        if (!(this.vars.target instanceof SDNode)) this.__replaceBrace(l, r);
        if (this.duration() > 0 && this.opacity() === 0) {
            const context = new Context(this);
            context.till(0, 0);
            this.vars.setTogether({
                sourceElement: l,
                targetElement: r,
            });
            context.till(0, 1);
            this.opacity(1);
        } else {
            if (this.opacity() === 0) this.opacity(1);
            this.vars.setTogether({
                sourceElement: l,
                targetElement: r,
            });
        }
        return this;
    }

    __replaceBrace(l: SDNode, r: SDNode): void {
        if (this.vars.sourceElement) this.vars.sourceElement.eraseChild(this);
        if (this.vars.targetElement) this.vars.targetElement.eraseChild(this);
        l.childAs(this);
        r.childAs(this);
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
        if (arguments.length === 0) return this.vars.valueGap;
        Check.validateNumber(gap!, "Brace.valueGap");
        this.vars.lpset("valueGap", gap);
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
        if (arguments.length === 0) return this.vars.braceGap;
        Check.validateNumber(gap!, "Brace.braceGap");
        this.vars.lpset("braceGap", gap);
        return this;
    }

    /**
     * Gets the location of the brace component relative to its target components.
     * @returns The location.
     */
    location(): Location;
    /**
     * Sets the location of the brace component relative to its target components. Defaults to `"t"`.
     * - "l": left.
     * - "r": right.
     * - "t": top.
     * - "b": bottom.
     * @param location - The location to apply.
     * @returns The current component instance for method chaining.
     */
    location(location: Location): this;
    location(location?: Location): Location | this {
        if (arguments.length === 0) return this.vars.location;
        Check.validateLocation(location!, LOCATION_KEY, "Brace.location", 1, LOCATION_KEY_SUGGESTION);
        this.vars.location = location;
        return this;
    }
}

/**
 * Creates a **`sd.Brace`** instance to brace a region.
 * @param target - The destination to render the plugin.
 * @param location - The location of the brace component: "l" (left), "r" (right), "t" (top), "b" (bottom). Defaults to "t".
 * @param braceGap - The gap between the brace and its target components. Defaults to 5.
 * @param valueGap - The gap between the brace and its value component. Defaults to 5.
 * @returns A new Brace instance.
 */
export function Brace(
    target: SDNode | RenderNode,
    location: Location = "t",
    braceGap: number = 5,
    valueGap: number = 5
): BracePlugin {
    return new BracePlugin(target).location(location).braceGap(braceGap).valueGap(valueGap);
}
