import { Context } from "@/Animate/Context";
import { BaseArray } from "@/Node/Array/BaseArray";
import { BaseGrid } from "@/Node/Grid/BaseGrid";
import { ValueManageMixin } from "@/Node/Mixin/ValueManageMixin";
import { Line } from "@/Node/Path/Line";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

type Direction = "l" | "r" | "t" | "b";

const DIRECTION_KEY = new Set(["l", "r", "t", "b"]);
const DIRECTION_KEY_SUGGESTION = [
    () => true,
    "For pointer component, here are 4 types of directions which are 'l', 'r', 't', 'b'.",
];
const pointerMap: Record<number, any[]> = {};

class PointerPlugin extends ValueManageMixin(Line) {
    static __addPointerMap(pointer: PointerPlugin, element: any): void {
        if (!pointerMap[element.id]) pointerMap[element.id] = [];
        pointerMap[element.id].push(pointer);
    }

    static __erasePointerMap(pointer: PointerPlugin): void {
        const element = pointer.vars.element;
        if (!element) return;
        pointerMap[element.id] = pointerMap[element.id].filter((p: PointerPlugin) => p !== pointer);
        if (pointerMap[element.id].length >= 1) pointerMap[element.id][0].triggerEffect("pointer");
    }

    constructor(target: SDNode | RenderNode, text: string = "") {
        super(target);

        this.opacity(0).arrow();

        this.vars.merge({
            element: undefined,
            length: 20,
            direction: "b",
            pointerGap: 3,
            valueGap: 3,
            gap: 10,
        });

        this.type("Pointer");

        if (target instanceof SDNode) target.childAs(this);
        if (text) this.value(text);

        this.effect("pointer", () => {
            const element = this.vars.element;
            if (!element) return;
            const direction = this.direction();
            const pointers = pointerMap[element.id].filter(
                (p: any) => p.direction() === direction && (p.opacity() !== 0 || p === this)
            );
            pointers.sort((a: any, b: any) => a.id - b.id);
            const elementlength = direction === "t" || direction === "b" ? element.width() : element.height();
            let gapLength = 0;
            for (let i = 1; i < pointers.length; i++) {
                gapLength += Math.max(pointers[i - 1].gap(), pointers[i].gap());
            }

            function layout(pointer: any, x: number, y: number) {
                const gap = pointer.pointerGap();
                const length = pointer.length();
                if (direction === "t") pointer.source(x, y + gap + length).target(x, y + gap);
                if (direction === "b") pointer.source(x, y - gap - length).target(x, y - gap);
                if (direction === "r") pointer.source(x - gap - length, y).target(x - gap, y);
                if (direction === "l") pointer.source(x + gap + length, y).target(x + gap, y);
            }

            if (gapLength <= elementlength) {
                pointers.forEach((pointer: any, i: number) => {
                    const k = (i + 1) / (pointers.length + 1);
                    let x: number;
                    let y: number;
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
                pointers.forEach((pointer: any, i: number) => {
                    if (i >= 1) current += Math.max(pointers[i - 1].gap(), pointer.gap());
                    let x: number;
                    let y: number;
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
    }

    __defaultValueRule() {
        return (parent: PointerPlugin, child: SDNode) => {
            const gap = parent.valueGap();
            const direction = parent.direction();
            if (direction === "t") child.cx(parent.cx()).y(parent.my() + gap);
            if (direction === "b") child.cx(parent.cx()).my(parent.y() - gap);
            if (direction === "r") child.cy(parent.cy()).mx(parent.x() - gap);
            if (direction === "l") child.cy(parent.cy()).x(parent.mx() + gap);
        };
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
        if (arguments.length === 0) return this.vars.valueGap;
        Check.validateNumber(gap!, "Pointer.valueGap");
        this.vars.lpset("valueGap", gap);
        return this;
    }

    /**
     * Gets the gap between this pointer component and the pointed element.
     * @returns The gap.
     */
    pointerGap(): number;
    /**
     * Sets the gap between this pointer component and the pointed element.
     * @param gap - The gap to apply.
     * @returns The current component instance for method chaining.
     */
    pointerGap(gap: number): this;
    pointerGap(gap?: number): number | this {
        if (arguments.length === 0) return this.vars.pointerGap;
        Check.validateNumber(gap!, "Pointer.pointerGap");
        this.vars.lpset("pointerGap", gap);
        return this;
    }

    /**
     * Gets the minimum gap between adjacent pointers pointing to the same element.
     * @returns The gap.
     */
    gap(): number;
    /**
     * Sets the minimum gap between adjacent pointers pointing to the same element. Default to `10`.
     * @param gap - The gap to apply.
     * @returns The current component instance for method chaining.
     */
    gap(gap: number): this;
    gap(gap?: number): number | this {
        if (arguments.length === 0) return this.vars.gap;
        Check.validateNumber(gap!, "Pointer.gap");
        this.vars.lpset("gap", gap);
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
        if (arguments.length === 0) return this.vars.length;
        Check.validateNumber(length!, "Pointer.length");
        this.vars.lpset("length", length);
        return this;
    }

    /**
     * Gets the direction of this pointer component.
     * @returns The direction.
     */
    direction(): Direction;
    /**
     * Sets the direction of this pointer component.
     * - "l": left.
     * - "r": right.
     * - "t": top.
     * - "b": bottom.
     * @param direction - The direction to apply.
     * @returns The current component instance for method chaining.
     */
    direction(direction: Direction): this;
    direction(direction?: Direction): Direction | this {
        if (arguments.length === 0) return this.vars.direction;
        Check.validateDirection(direction!, DIRECTION_KEY, "Pointer.direction", 1, DIRECTION_KEY_SUGGESTION);
        this.vars.direction = direction;
        return this;
    }

    moveTo(x?: any, y?: any): this {
        if (Check.isEmpty(x)) {
            PointerPlugin.__erasePointerMap(this);
            this.vars.element = undefined;
            return this.opacity(0);
        }

        const parent = this._.parent;
        if (arguments.length === 2) return this.moveTo((parent as BaseGrid).element(x, y));
        else if (arguments.length === 1 && !(x instanceof SDNode)) return this.moveTo((parent as BaseArray).element(x));

        PointerPlugin.__erasePointerMap(this);

        if (this.duration() > 0 && this.opacity() === 0) {
            const context = new Context(this);
            context.till(0, 0);
            PointerPlugin.__addPointerMap(this, x);
            this.vars.element = x;
            context.till(0, 1);
            this.opacity(1);
        } else {
            if (this.opacity() === 0) this.opacity(1);
            PointerPlugin.__addPointerMap(this, x);
            this.vars.element = x;
        }

        return this;
    }

    /**
     * Gets the component pointed by this pointer component.
     * @returns The pointed component, or undefined if no component is pointed by this pointer component.
     */
    pointElement(): any {
        return this.vars.element;
    }
}

/**
 * Creates a **`sd.Pointer`** instance.
 * @param target - The target node to attach the pointer to.
 * @param text - The text label for the pointer.
 * @param direction - The direction of the pointer: "l" (left), "r" (right), "t" (top), "b" (bottom).
 * @param pointerGap - The gap between the pointer and the pointed element.
 * @param length - The length of the pointer line.
 * @param valueGap - The gap between the pointer and its text label.
 * @param gap - The minimum gap between adjacent pointers pointing to the same element.
 * @returns A new Pointer instance.
 */
export function Pointer(
    target: SDNode,
    text: string = "",
    direction: Direction = "b",
    pointerGap: number = 3,
    length: number = 20,
    valueGap: number = 3,
    gap: number = 10
): PointerPlugin {
    return new PointerPlugin(target, text)
        .direction(direction)
        .pointerGap(pointerGap)
        .length(length)
        .valueGap(valueGap)
        .gap(gap);
}
