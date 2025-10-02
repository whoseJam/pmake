import { Array } from "@/Node/Array/Array";
import { Enter as EN } from "@/Node/Core/Enter";
import { Box } from "@/Node/Element/Box";
import { BaseGrid } from "@/Node/Grid/BaseGrid";
import { SDNode } from "@/Node/SDNode";
import { Rect } from "@/Node/Shape/Rect";
import { RenderNode } from "@/Renderer/RenderNode";

type Align = "x" | "cx" | "mx" | "y" | "cy" | "my";
type Axis = "row" | "col";

/**
 * Grid component implementing the value-inside-element strategy.
 *
 * Renders a uniform grid where each element is an **`sd.Box`** instance.
 * All cells are guaranteed to be of the same type and size,
 * ensuring consistent layout and rendering behavior across the grid.
 *
 * @example
 * const grid = new sd.Grid(svg).n(5).m(3).startN(1).startM(1);
 * grid.startAnimate().color(1, 2, C.red).endAnimate();
 * grid.startAnimate().axis("col").endAnimate();
 * grid.startAnimate().elementWidth(50).endAnimate();
 */
export class Grid<E = Box, V = SDNode> extends BaseGrid<E, V> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("Grid");

        this.vars.merge({
            x: 0,
            y: 0,
            elementWidth: 40,
            elementHeight: 40,
            width: 0,
            height: 0,
            main: "row",
            align: "x",
        });

        this.effect("grid", () => {
            const dict = {
                x: this.x(),
                y: this.y(),
                mx: this.mx(),
                my: this.my(),
                lx: this.elementWidth(),
                ly: this.elementHeight(),
            };
            const elements = this.vars.elements;
            const main = this.axis();
            const align = this.align();
            const mainAxis = main === "row" ? "y" : "x";
            const auxiAxis = main === "row" ? "x" : "y";
            const m = this.m();
            const offset = align === "x" || align === "y" ? offsetN : align === "cx" || align === "cy" ? offsetC : offsetM;
            for (let i = 0; i < elements.length; i++) {
                if (!elements[i]) continue;
                for (let j = 0; j < elements[i].length; j++) {
                    const element = elements[i][j];
                    this.tryUpdate(element, () => {
                        element.width(dict["lx"]);
                        element.height(dict["ly"]);
                        element[mainAxis](dict[mainAxis] + i * dict[`l${mainAxis}`]);
                        element[auxiAxis](dict[auxiAxis] + (offset(m, elements[i].length) + j) * dict[`l${auxiAxis}`]);
                    });
                }
            }
        });
    }
    x(): number;
    x(x: number): this;
    x() {
        return Rect.prototype.x.apply(this, arguments);
    }
    y(): number;
    y(y: number): this;
    y() {
        return Rect.prototype.y.apply(this, arguments);
    }
    width(): number;
    width(width: number): this;
    width(width?: number) {
        const label = this.vars.main === "row" ? "m" : "n";
        if (width === undefined) return this[label]() * this.elementWidth();
        const length = this[label]() ? this[label]() : 1;
        this.elementWidth(width / length);
        return this;
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        const label = this.vars.main === "row" ? "n" : "m";
        if (height === undefined) return this[label]() * this.elementHeight();
        const length = this[label]() ? this[label]() : 1;
        this.elementHeight(height / length);
        return this;
    }
    insert(i: number, j: number, value: any) {
        const element = new Box(this.layer("elements"), value).opacity(0);
        element.onEnter(EN.appear("elements"));
        this.__insert(i, j, element as E);
        return this;
    }
    insertFromExistValue(i: number, j: number, value: V) {
        const element = new Box(this.layer("elements")).opacity(0);
        element.onEnter(EN.appear("elements"));
        this.__insert(i, j, element as E);
        element.valueFromExist(value as SDNode);
        return this;
    }
    insertFromExistElement(i: number, j: number, element: E) {
        const element_ = element as SDNode;
        element_.onEnter(EN.moveTo("elements"));
        this.__insert(i, j, element);
        return this;
    }
    /**
     * Gets the element width of this grid component.
     * @returns The uniform width of all grid elements.
     */
    elementWidth(): number;
    /**
     * Sets the element width of this grid component. Defaults to `40`.
     * @param width - The uniform width of all grid elements.
     * @returns The current component instance for method chaining.
     */
    elementWidth(width: number): this;
    elementWidth() {
        return Array.prototype.elementWidth.apply(this, arguments);
    }
    /**
     * Gets the element height of this grid component.
     * @returns The uniform height of all grid elements.
     */
    elementHeight(): number;
    /**
     * Sets the element height of this grid component. Defaults to `40`.
     * @param width - The uniform height of all grid elements.
     * @returns The current component instance for method chaining.
     */
    elementHeight(height: number): this;
    elementHeight() {
        return Array.prototype.elementHeight.apply(this, arguments);
    }
    /**
     * Gets the axis orientation of this grid component.
     * @returns The axis orientation.
     */
    axis(): Axis;
    /**
     * Sets the axis orientation of this grid component. Defaults to "row".
     *
     * Determines the primary layout direction.
     * - "row": Elements are laid out horizontally first.
     * - "col": Elements are laid out vertically first.
     * @param axis - The axis orientation to apply.
     * @returns The current component instance for method chaining.
     */
    axis(main: Axis): this;
    axis(main?: Axis) {
        if (arguments.length === 0) return this.vars.main;
        this.vars.main = main;
        return this;
    }
    /**
     * Gets the alignment mode of this grid component.
     * @returns The alignment mode.
     */
    align(): Align;
    /**
     * Sets the alignment mode of this grid component. Defaults to "x".
     *
     * Determines secondary dimension alignment based on the current layout direction.
     * - "x" | "y": Align left/top based on primary dimension.
     * - "cx" | "cy": Align center based on primary dimension.
     * - "mx" | "my": Align right/bottom based on primary dimension.
     * @param align - The alignment mode to apply.
     * @returns The current component instance for method chaining.
     */
    align(align: Align): this;
    align(align?: Align) {
        if (arguments.length === 0) return this.vars.align;
        this.vars.align = align;
        return this;
    }
}

function offsetN() {
    return 0;
}

function offsetC(m: number, length: number) {
    return (m - length) / 2;
}

function offsetM(m: number, length: number) {
    return m - length;
}
