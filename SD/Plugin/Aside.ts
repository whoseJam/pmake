import { SDNode } from "@/Node/SDNode";
import { Rule as R } from "@/Rule/Rule";
import { Check } from "@/Utility/Check";

type Location = "tl" | "tc" | "tr" | "lt" | "lc" | "lb" | "bl" | "bc" | "br" | "rt" | "rc" | "rb";

const LOCATION_KEY = new Set(["tl", "tc", "tr", "lt", "lc", "lb", "bl", "bc", "br", "rt", "rc", "rb"]);
const LOCATION_KEY_SUGGESTION = [
    () => true,
    "For aside plugin, here are 12 types of locations which are 'tl', 'tc', 'tr', 'lt', 'lc', 'lb', 'bl', 'bc', 'br', 'rt', 'rc', 'rb'.",
];

class AsidePlugin {
    /**
     * Gets the gap between the aside component and its target component.
     * @returns The gap.
     */
    gap(): number;
    /**
     * Sets the gap between the aside component and its target component. Defaults to `5`.
     * @param gap - The gap to apply.
     * @returns The current component instance for method chaining.
     */
    gap(gap: number): this;
    gap(gap?: number): number | this {
        if (arguments.length === 0) return (this as any).vars.gap;
        Check.validateNumber(gap!, "AsidePlugin.aside");
        (this as any).vars.lpset("gap", gap);
        return this;
    }
    /**
     * Gets the location of the aside component relative to its target component.
     * @returns The location.
     */
    location(): string;
    /**
     * Sets the location of the aside component relative to its target component. Defaults to `"lc"`.
     * - "lt": left-top.
     * - "lc": left-center.
     * - "lb": left-bottom.
     * - "rt": right-top.
     * - "rc": right-center.
     * - "rb": right-bottom.
     * - "tl": top-left.
     * - "tc": top-center.
     * - "tr": top-right.
     * - "bl": bottom-left.
     * - "bc": bottom-center.
     * - "br": bottom-right.
     * @param location - The location to apply.
     * @returns The current component instance for method chaining.
     */
    location(location: string): this;
    location(location?: string): string | this {
        if (arguments.length === 0) return (this as any).vars.location;
        Check.validateLocation(location!, LOCATION_KEY, "AsidePlugin.location", 1, LOCATION_KEY_SUGGESTION);
        (this as any).vars.location = location;
        return this;
    }
}

/**
 * Creates a **`sd.AsidePlugin`** instance to position a component alongside another component with specified layout rules.
 *
 * This function extends the component named aside with plugin methods for configuring its position and spacing relative to the target component.
 * @param target
 * @param aside
 * @param location
 * @param gap
 * @returns A new plugin instance.
 */
export function Aside<T>(target: SDNode, self: T, location: string = "lc", gap: number = 5): T & AsidePlugin {
    Check.validateLocation(location, LOCATION_KEY, "Aside", 3, LOCATION_KEY_SUGGESTION);
    Check.validateNumber(gap, "Aside", 4);

    (self as any).vars.merge({
        gap,
        location,
    });

    (self as any).gap = AsidePlugin.prototype.gap;
    (self as any).location = AsidePlugin.prototype.location;

    target.childAs(self, function (parent: SDNode, child: SDNode) {
        const rule = R.aside((child as any).vars.location, (child as any).vars.gap);
        rule(parent, child);
    });

    return self as T & AsidePlugin;
}
