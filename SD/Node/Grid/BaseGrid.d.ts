import { SDNode } from "@/Node/SDNode";
import { SDColor } from "@/Utility/Color";

export class BaseGrid extends SDNode {
    constructor(parent: SDNode);

    startN(): number;
    startN(start: number): this;
    startM(): number;
    startM(start: number): this;
    endN(): number;
    endM(): number;
    endM(index: number): number;

    idxN(index: number): number;
    idxM(index: number): number;
    n(n: number): this;
    m(m: number): this;

    pushCol(): this
    pushCol(rows: number): this;
    pushRow(columns: number): this;

    element(i: number, j: number): SDNode;

    value(i: number, j: number): SDNode;
    value(i: number, j: number, value: SDNode): this;
    intValue(i: number, j: number): number;

    opacity(): number;
    opacity(opacity: number): this;
    opacity(i: number, j: number): number;
    opacity(i: number, j: number, opacity: number): this;

    color(color: SDColor): this;
    color(i: number, j: number): SDColor;
    color(i: number, j: number, color: SDColor): SDColor;

    forEachElement(callback: (element: SDNode, rowId: number, colId: number) => void): this;
}