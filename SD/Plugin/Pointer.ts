import { Context } from "@/Animate/Context";
import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { Check } from "@/Utility/Check";

type Direction = "l" | "r" | "t" | "b";

const DIRECTION_KEY = new Set(["l", "r", "t", "b"]);
const DIRECTION_KEY_SUGGESTION = [
    () => true,
    "For pointer component, here are 4 types of directions which are 'l', 'r', 't', 'b'.",
];
const pointerMap: Record<string, any[]> = {};

class PointerPlugin {
    /**
     * Gets the minimum gap between the adjacent pointers point to the same pointed component.
     * @returns The gap.
     */
    gap(): number;
    /**
     * Sets the minimum gap between the adjacent pointers point to the same pointed component.
     * @param gap - The gap to apply.
     * @returns The current component instance for method chaining.
     */
    gap(gap: number): this;
    gap(gap?: number): number | this {
        if (arguments.length === 0) return (this as any).pointerGap();
        return (this as any).pointerGap(gap);
    }
    /**
     * Gets the gap between the pointer component and its value component.
     * @returns The gap.
     */
    valueGap(): number;
    /**
     * Sets the gap between this pointer component and its value component. Default to `3`.
     * @param gap - The gap to apply.
     * @returns The current component instance for method chaining.
     */
    valueGap(gap: number): this;
    valueGap(gap?: number): number | this {
        if (arguments.length === 0) return (this as any).vars.valueGap;
        Check.validateNumber(gap!, "PointerPlugin.valueGap");
        (this as any).vars.lpset("valueGap", gap);
        return this;
    }
    /**
     * Gets the gap between this pointer component and its value component.
     * @returns The gap.
     */
    pointerGap(): number;
    /**
     * Sets the gap between this pointer component and its value component.
     * @param gap - The gap to apply.
     * @returns The current component instance for method chaining.
     */
    pointerGap(gap: number): this;
    pointerGap(gap?: number): number | this {
        if (arguments.length === 0) return (this as any).vars.pointerGap;
        Check.validateNumber(gap!, "PointerPlugin.pointerGap");
        (this as any).vars.lpset("pointerGap", gap);
        return this;
    }
    /**
     * Gets the length of this pointer component.
     * @returns The length.
     */
    length(): number;
    /**
     * Sets the length of this pointer component.
     * @param length - The length to apply.
     * @returns The current component instance for method chaining.
     */
    length(length: number): this;
    length(length?: number): number | this {
        if (arguments.length === 0) return (this as any).vars.length;
        Check.validateNumber(length!, "PointerPlugin.length");
        (this as any).vars.lpset("length", length);
        return this;
    }
    /**
     * Gets the direction of this pointer component.
     * @returns The direction.
     */
    direction(): string;
    /**
     * Sets the direction of this pointer component.
     * - "l": left.
     * - "r": right.
     * - "t": top.
     * - "b": bottom.
     * @param direction - The drection to apply.
     * @returns The current component instance for method chaining.
     */
    direction(direction: string): this;
    direction(direction?: string): string | this {
        if (arguments.length === 0) return (this as any).vars.direction;
        Check.validateDirection(direction!, DIRECTION_KEY, "PointerPlugin.direction", 1, DIRECTION_KEY_SUGGESTION);
        (this as any).vars.direction = direction;
        return this;
    }
    moveTo(x?: any, y?: any): this {
        const self = this as any;
        if (Check.isEmpty(x)) {
            erasePointerMap(self);
            self.vars.element = undefined;
            return self.opacity(0);
        }
        if (arguments.length === 2) return this.moveTo(self.vars.target.element(x, y));
        else if (arguments.length === 1 && !(x instanceof SDNode)) return this.moveTo(self.vars.target.element(x));
        erasePointerMap(self);
        if (self.duration() > 0 && self.opacity() === 0) {
            const context = new Context(self);
            context.till(0, 0);
            addPointerMap(self, x);
            self.vars.element = x;
            context.till(0, 1);
            self.opacity(1);
        } else {
            if (self.opacity() === 0) self.opacity(1);
            addPointerMap(self, x);
            self.vars.element = x;
        }
        return this;
    }
    /**
     * Gets the component pointed by this pointer component.
     * @returns The pointed component, or undefined if no component is pointed by this pointer component.
     */
    pointElement(): any {
        return (this as any).vars.element;
    }
}

/**
 * Creates a **`sd.PointerPlugin`** instance.
 * @param target
 * @param label
 * @param direction
 * @param gap
 * @param length
 * @returns A new plugin instance.
 */
export function Pointer(
    target: SDNode,
    text: string = "",
    direction: string = "b",
    pointerGap: number = 3,
    length: number = 20,
    valueGap: number = 3
): Line & PointerPlugin {
    const self = new Line(target).opacity(0).arrow() as any;

    self.vars.merge({
        target,
        element: undefined,
        length,
        direction,
        pointerGap,
        valueGap,
        gap: 10,
    });

    self.value = PointerPlugin.prototype.value;
    self.valueFromExist = PointerPlugin.prototype.valueFromExist;
    self.valueGap = PointerPlugin.prototype.valueGap;
    self.pointerGap = PointerPlugin.prototype.pointerGap;
    self.direction = PointerPlugin.prototype.direction;
    self.length = PointerPlugin.prototype.length;
    self.moveTo = PointerPlugin.prototype.moveTo;
    self.pointElement = PointerPlugin.prototype.pointElement;
    self.gap = PointerPlugin.prototype.gap;

    self.effect("pointer", () => {
        const element = self.vars.element;
        if (!element) return;
        const direction = self.direction();
        const pointers = pointerMap[element.id].filter(
            p => p.direction() === direction && (p.opacity() !== 0 || p === self)
        );
        pointers.sort((a, b) => a.id - b.id);
        const elementlength = getLength(element, direction);
        const gapLength = getGapLength(pointers);
        function layout(pointer, x, y) {
            const gap = pointer.pointerGap();
            const length = pointer.length();
            if (direction === "t") pointer.source(x, y + gap + length).target(x, y + gap);
            if (direction === "b") pointer.source(x, y - gap - length).target(x, y - gap);
            if (direction === "r") pointer.source(x - gap - length, y).target(x - gap, y);
            if (direction === "l") pointer.source(x + gap + length, y).target(x + gap, y);
        }
        if (gapLength <= elementlength) {
            pointers.forEach((pointer, i) => {
                const k = (i + 1) / (pointers.length + 1);
                let x;
                let y;
                if (direction === "t" || direction === "b") {
                    x = element.kx(k);
                    if (direction === "t") y = element.my();
                    if (direction === "b") y = element.y();
                } else {
                    if (direction === "l") x = element.mx();
                    if (direction === "r") x = element.x();
                    y = element.ky(k);
                }
                layout(pointer, x, y);
            });
        } else {
            let current = 0;
            pointers.forEach((pointer, i) => {
                if (i >= 1) current += Math.max(pointers[i - 1].gap(), pointer.gap());
                let x;
                let y;
                if (direction === "t" || direction === "b") {
                    x = element.cx() + (current - gapLength / 2);
                    if (direction === "t") y = element.my();
                    if (direction === "b") y = element.y();
                } else {
                    if (direction === "l") x = element.mx();
                    if (direction === "r") x = element.x();
                    y = element.cy() + (current - gapLength / 2);
                }
                layout(pointer, x, y);
            });
        }
    });

    if (target instanceof SDNode) target.childAs(self);

    self.value(text);

    return self as Line & PointerPlugin;
}

function getLength(element: any, direction: string): number {
    if (direction === "t" || direction === "b") return element.width();
    return element.height();
}

function getGapLength(pointers: any[]): number {
    let length = 0;
    for (let i = 1; i < pointers.length; i++) length += Math.max(pointers[i - 1].gap(), pointers[i].gap());
    return length;
}

function labelRule(parent: any, child: SDNode): void {
    const gap = parent.valueGap();
    const direction = parent.direction();
    if (direction === "t") child.cx(parent.cx()).y(parent.my() + gap);
    if (direction === "b") child.cx(parent.cx()).my(parent.y() - gap);
    if (direction === "r") child.cy(parent.cy()).mx(parent.x() - gap);
    if (direction === "l") child.cy(parent.cy()).x(parent.mx() + gap);
}

function addPointerMap(pointer: any, element: any): void {
    if (!pointerMap[element.id]) pointerMap[element.id] = [];
    pointerMap[element.id].push(pointer);
}

function erasePointerMap(pointer: any): void {
    const element = pointer.vars.element;
    if (!element) return;
    pointerMap[element.id] = pointerMap[element.id].filter((p: any) => p !== pointer);
    if (pointerMap[element.id].length >= 1) pointerMap[element.id][0].triggerEffect("pointer");
}
