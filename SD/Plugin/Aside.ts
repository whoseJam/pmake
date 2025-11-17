import { SDNode } from "@/Node/SDNode";
import { Rule as R } from "@/Rule/Rule";
import { Check } from "@/Utility/Check";

type Location = "tl" | "tc" | "tr" | "lt" | "lc" | "lb" | "bl" | "bc" | "br" | "rt" | "rc" | "rb";

const LOCATION_KEY = new Set(["tl", "tc", "tr", "lt", "lc", "lb", "bl", "bc", "br", "rt", "rc", "rb"]);
const LOCATION_KEY_SUGGESTION = [
    () => true,
    "For aside plugin, here are 12 types of locations which are 'tl', 'tc', 'tr', 'lt', 'lc', 'lb', 'bl', 'bc', 'br', 'rt', 'rc', 'rb'.",
];

interface AsidePluginMethods {
    gap(): number;
    gap(gap: number): this;
    location(): Location;
    location(location: Location): this;
    targetElement(): SDNode;
}

/**
 * Creates a **`sd.Aside`** instance to position a component alongside another component.
 * @param target - The target component to position relative to.
 * @param self - The component to be positioned.
 * @param location - The location relative to the target. Defaults to `"lc"`.
 * @param gap - The gap between the components. Defaults to `5`.
 * @returns The component with Aside plugin methods.
 */
export function Aside<T extends SDNode>(
    target: SDNode,
    self: T,
    location: Location = "lc",
    gap: number = 5
): T & AsidePluginMethods {
    Check.validateLocation(location, LOCATION_KEY, "Aside", 3, LOCATION_KEY_SUGGESTION);
    Check.validateNumber(gap, "Aside", 4);

    self.vars.merge({
        __asideTarget: target,
        gap,
        location,
    });

    self.effect("aside", () => {
        const rule = R.aside(self.vars.location, self.vars.gap);
        rule(self.vars.__asideTarget, self);
    });

    target.childAs(self);

    // Add plugin methods to self
    const plugin = self as T & AsidePluginMethods;

    /**
     * Gets the gap between the aside component and its target component.
     * @returns The gap.
     */
    plugin.gap = function (this: T, gap?: number): number | (T & AsidePluginMethods) {
        if (arguments.length === 0) return this.vars.gap;
        Check.validateNumber(gap!, "AsidePlugin.gap");
        this.vars.lpset("gap", gap);
        return this as T & AsidePluginMethods;
    };

    /**
     * Gets the location of the aside component relative to its target component.
     * @returns The location.
     */
    plugin.location = function (this: T, location?: Location): Location | (T & AsidePluginMethods) {
        if (arguments.length === 0) return this.vars.location;
        Check.validateLocation(location!, LOCATION_KEY, "AsidePlugin.location", 1, LOCATION_KEY_SUGGESTION);
        this.vars.location = location;
        return this as T & AsidePluginMethods;
    };

    /**
     * Gets the target component that this aside component is positioned relative to.
     * @returns The target component.
     */
    plugin.targetElement = function (this: T): SDNode {
        return this.vars.__asideTarget;
    };

    return plugin;
}
