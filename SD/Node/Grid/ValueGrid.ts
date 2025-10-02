import { Grid } from "@/Node/Grid/Grid";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * Grid component implementing the value-as-element strategy.
 *
 * Renders a grid where each cell can contain an arbitrary component instance.
 * This provides maximum flexibility for composing grid structures, as each element
 * can differ in type and appearance.
 *
 * @example
 * const n = 3;
 * const m = 5;
 * const grid = new sd.Grid(svg).startN(1).startM(1);
 * grid.insert(1, 1, new sd.Text(grid, "hello"));
 * grid.insert(1, 2, new sd.Circle(grid));
 * grid.insert(1, 3, new sd.Button(grid));
 */
export class ValueGrid<E = SDNode, V = SDNode> extends Grid<E, V> {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("ValueGrid");

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
                        element[mainAxis](dict[mainAxis] + i * dict[`l${mainAxis}`]);
                        element[auxiAxis](dict[auxiAxis] + (offset(m, elements[i].length) + j) * dict[`l${auxiAxis}`]);
                    });
                }
            }
        });
    }
    insert(i: number, j: number, value: any) {
        const element = value instanceof SDNode ? (value as SDNode) : SDNode.__asNode(this.layer("elements"), value);
        this.__insert(i, j, element as E);
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
