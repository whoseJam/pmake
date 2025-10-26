import { Enter as EN } from "@/Node/Core/Enter";
import { Exit as EX } from "@/Node/Core/Exit";
import { BaseGrid } from "@/Node/Grid/BaseGrid";
import { SDNode } from "@/Node/SDNode";
import { SD2DNode } from "@/Node/SD2DNode";
import { Text } from "@/Node/Text/Text";
import { Rule as R } from "@/Rule/Rule";
import { Check } from "@/Utility/Check";
import { ObjectPool } from "@/Utility/Pool/ObjectPool";

type Location = "l" | "r" | "t" | "b";

const LOCATION_KEY = new Set(["l", "r", "t", "b"]);
const LOCATION_KEY_SUGGESTION = [() => true, "For self plugin, here are 4 types of locations which are 'l', 'r', 't', 'b'."];

class IndexPlugin {
    /**
     * Gets the target component of this index component.
     * @returns The target component.
     */
    target(): any;
    /**
     * Sets the target component of this index component.
     * @param target - The target component to apply.
     * @returns The current component instance for method chaining.
     */
    target(target: SDNode): this;
    target(target?: SDNode): any | this {
        if (arguments.length === 0) return (this as any).vars.target;
        Check.validateSDNode(target!, "IndexPlugin.target");
        (this as any).vars.target.eraseChild((this as any).onExit(EX.nothing()));
        (this as any).vars.target = target;
        (this as any).vars.target.childAs(this);
        return this;
    }
    /**
     * Gets the gap between this index component and its target component.
     * @returns The gap.
     */
    gap(): number;
    /**
     * Sets the gap between this index component and its target component. Defaults to `3`.
     * @param gap - The gap to apply.
     * @returns The current component instance for method chaining.
     */
    gap(gap: number): this;
    gap(gap?: number): number | this {
        if (arguments.length === 0) return (this as any).vars.gap;
        Check.validateNumber(gap!, "IndexPlugin.gap");
        (this as any).vars.lpset("gap", gap);
        return this;
    }
    /**
     * Gets the location of this index component relative to its target component.
     * @returns The location.
     */
    location(): string;
    /**
     * Sets the location of this index component relative to its target component. Defaults to `"t"`.
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
        Check.validateLocation(location!, LOCATION_KEY, "IndexPlugin.location");
        (this as any).vars.location = location;
        return this;
    }
    /**
     * Gets the font size of this index component.
     * @returns The font size.
     */
    fontSize(): number;
    /**
     * Sets the font size of this index component. Defaults to `15`.
     * @param fontSize - The font size to apply.
     * @returns The current component instance for method chaining.
     */
    fontSize(size: number): this;
    fontSize(size?: number): number | this {
        if (arguments.length === 0) return (this as any).vars.fontSize;
        Check.validateNumber(size!, "IndexPlugin.fontSize");
        (this as any).vars.fontSize = size;
        return this;
    }

}

/**
 * Creates a **`sd.IndexPlugin`** instance.
 * @param target
 * @param location
 * @param fontSize
 * @param gap
 */
export function Index(target: SDNode, location: string = "t", fontSize: number = 15, gap: number = 3): SD2DNode & IndexPlugin {
    Check.validateLocation(location, LOCATION_KEY, "Index", 2, LOCATION_KEY_SUGGESTION);
    Check.validateNumber(fontSize, "Index", 3);
    Check.validateNumber(gap, "Index", 4);

    const self = new SDNode(target) as any;

    self.type("Index");

    self.vars.merge({
        target,
        gap,
        location,
        fontSize,
    });

    self.gap = IndexPlugin.prototype.gap;
    self.target = IndexPlugin.prototype.target;
    self.location = IndexPlugin.prototype.location;
    self.fontSize = IndexPlugin.prototype.fontSize;

    const indexPool = createIndexPool(self);


    self.effect("index", () => {
        const target = self.vars.target;
        const location = self.location();
        const gap = self.gap() + (location === "l" || location === "r") * 3;
        const start = getStart(target, location);
        const length = getLength(target, location);
        indexPool.beforeAllocate();
        for (let i = start; i < start + length; i++) {
            const index = indexPool.allocate(i).fontSize(self.fontSize());
            self.tryUpdate(index, () => {
                asideRule(getElement(target, location, i), index, location, gap);
            });
        }
        indexPool.afterAllocate();
    });

    target.childAs(self);

    return self as SD2DNode & IndexPlugin;
}

function createIndexPool(index: any): ObjectPool<Text> {
    return new ObjectPool({
        onIdle(text: Text) {
            text.opacity(0);
        },
        getIdle(text: Text) {
            return text.onEnter(EN.appear());
        },
        getUsed(text: Text) {
            return text.onEnter(EN.moveTo());
        },
        onCreate(i: number) {
            const text = new Text(index, i);
            index.childAs(text);
            return text;
        },
    });
}

function asideRule(element: SDNode, self: SDNode, location: string, gap: number): void {
    R.aside(location + "c", gap)(element, self);
}

function getStart(target: any, location: string): number {
    if (target instanceof BaseGrid) {
        if (target.axis() === "row") return location === "t" || location === "b" ? target.startM() : target.startN();
        return location === "t" || location === "b" ? target.startN() : target.startM();
    }
    return target.start();
}

function getLength(target: any, location: string): number {
    if (target instanceof BaseGrid) {
        if (target.axis() === "row") return location === "t" || location === "b" ? target.m() : target.n();
        return location === "t" || location === "b" ? target.n() : target.m();
    }
    return target.length();
}

function getElement(target: any, location: string, i: number): SDNode {

    if (target instanceof BaseGrid) {
        if (target.axis() === "row") {
            if (location === "t") for (let rowId = target.startN(); rowId <= target.endN(); rowId++) if (target.endM(rowId) >= i) return target.element(rowId, i);
            if (location === "b") for (let rowId = target.endN(); rowId >= target.startN(); rowId--) if (target.endM(rowId) >= i) return target.element(rowId, i);
            if (location === "l") return target.element(i, target.startM());
            if (location === "r") return target.element(i, target.endM(i));
        } else {
            if (location === "t") return target.element(i, target.startM());
            if (location === "b") return target.element(i, target.endM(i));
            if (location === "l") for (let rowId = target.startN(); rowId <= target.endN(); rowId++) if (target.endM(rowId) >= i) return target.element(rowId, i);
            if (location === "r") for (let rowId = target.endN(); rowId >= target.startN(); rowId--) if (target.endM(rowId) >= i) return target.element(rowId, i);
        }
    }
    return target.element(i);
}

            if (location === "l")
                for (let rowId = target.startN(); rowId <= target.endN(); rowId++)
                    if (target.endM(rowId) >= i) return target.element(rowId, i);
            if (location === "r")
                for (let rowId = target.endN(); rowId >= target.startN(); rowId--)
                    if (target.endM(rowId) >= i) return target.element(rowId, i);
        }
    }
    return target.element(i);
}
