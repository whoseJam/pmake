import { Exit as EX } from "@/Node/Core/Exit";
import { SDNode } from "@/Node/SDNode";
import { BaseText } from "@/Node/Text/BaseText";
import { Math } from "@/Node/Text/Math";
import { Text } from "@/Node/Text/Text";
import { Rule as R } from "@/Rule/Rule";
import { Check } from "@/Utility/Check";

type Location = "tl" | "tc" | "tr" | "lt" | "lc" | "lb" | "bl" | "bc" | "br" | "rt" | "rc" | "rb";

const LOCATION_KEY = new Set(["tl", "tc", "tr", "lt", "lc", "lb", "bl", "bc", "br", "rt", "rc", "rb"]);
const LOCATION_KEY_SUGGESTION = [
    () => true,
    "For label component, here are 12 types of locations which are 'tl', 'tc', 'tr', 'lt', 'lc', 'lb', 'bl', 'bc', 'br', 'rt', 'rc', 'rb'.",
];

class LabelPlugin {
    /**
     * Gets the target component of this label component.
     * @returns The target component.
     */
    target(): any;
    /**
     * Sets the target component of this label component.
     * @param target - The target component to apply.
     * @returns The current component instance for method chaining.
     */
    target(target: SDNode): this;
    target(target?: SDNode): any | this {
        if (arguments.length === 0) return (this as any).vars.target;
        Check.validateSDNode(target!, "LabelPlugin.target");
        (this as any).vars.target.eraseChild((this as any).onExit(EX.nothing()));
        (this as any).vars.target = target;
        (this as any).vars.target.childAs(this);
        return this;
    }
    /**
     * Gets the gap between this label component and its target component.
     * @returns The gap.
     */
    gap(): number;
    /**
     * Sets the gap between this label component and its target component.
     * @param gap - The gap to apply.
     * @returns The current component instance for method chaining.
     */
    gap(gap: number): this;
    gap(gap?: number): number | this {
        if (arguments.length === 0) return (this as any).vars.gap;
        Check.validateNumber(gap!, "LabelPlugin.gap");
        (this as any).vars.lpset("gap", gap);
        return this;
    }
    /**
     * Gets the location of this label component relatives to its target component.
     * @returns The location.
     */
    location(): Location;
    /**
     * Sets the location of this label component relatives to its target component. Defaults to `"lc"`.
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
    location(location: Location): this;
    location(location?: Location): Location | this {
        if (arguments.length === 0) return (this as any).vars.location;
        Check.validateLocation(location!, LOCATION_KEY, "LabelPlugin.location", 1, LOCATION_KEY_SUGGESTION);
        (this as any).vars.location = location;
        return this;
    }
}

/**
 * Creates a **`sd.LabelPlugin`** instance.
 * @param target
 * @param text
 * @param location - Defaults to `"lc"`.
 * @param fontSize - Defaults to `20`.
 * @param gap - Defaults to `10`.
 */
export function Label(
    target: SDNode,
    text: string,
    location: string = "lc",
    fontSize: number = 20,
    gap: number = 10
): LabelPlugin & BaseText {
    Check.validateLocation(location, LOCATION_KEY, "Label", 3, LOCATION_KEY_SUGGESTION);
    Check.validateNumber(fontSize, "Label", 4);
    Check.validateNumber(gap, "Label", 5);

    const self = new (isMath(text) ? Math : Text)(target, text) as any;

    self.vars.merge({ target, location, gap });

    self.gap = LabelPlugin.prototype.gap;
    self.target = LabelPlugin.prototype.target;
    self.location = LabelPlugin.prototype.location;

    self.fontSize(fontSize);

    self.effect("label", () => {
        const target = self.vars.target;
        const rule = R.aside(self.location(), self.gap());
        rule(target, self);
    });

    target.childAs(self);

    return self as LabelPlugin & BaseText;
}

/**
 * Creates a **`sd.LabelPlugin`** instance.
 * @param target
 * @param text
 * @param location - Defaults to `"lc"`.
 * @param fontSize - Defaults to `20`.
 * @param gap - Defaults to `10`.
 * @returns A new plugin instance.
 */
export function MathLabel(
    target: SDNode,
    text: string,
    location: string = "lc",
    fontSize: number = 20,
    gap: number = 10
): LabelPlugin & BaseText {
    Check.validateLocation(location, LOCATION_KEY, "Label", 3, LOCATION_KEY_SUGGESTION);
    Check.validateNumber(fontSize, "Label", 4);
    Check.validateNumber(gap, "Label", 5);

    const self = new Math(target, text) as any;

    self.vars.merge({ target, location, gap });

    self.gap = LabelPlugin.prototype.gap;
    self.target = LabelPlugin.prototype.target;
    self.location = LabelPlugin.prototype.location;

    self.fontSize(fontSize);

    self.effect("label", () => {
        const target = self.vars.target;
        const rule = R.aside(self.location(), self.gap());
        rule(target, self);
    });

    target.childAs(self);

    return self as LabelPlugin & BaseText;
}

function isMath(str: string): boolean {
    const label = String(str).trim();
    return label.startsWith("$") && label.endsWith("$") && label.length >= 2;
}
