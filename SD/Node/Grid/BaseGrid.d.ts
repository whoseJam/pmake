import { Color } from "SD/Utility/Color";
import { SDNode } from "../SDNode";

export class BaseGrid extends SDNode {
    constructor(parent: any);

    startN(): number;
    startN(start: number): this;
    startM(): number;
    startM(start: number): this;
    endN(): number;
    endM(): number;
    endM(index: number): number;

    idxN(index: number): number;
    idxM(index: number): number;
    n(n: number): number;
    m(m: number): number;

    pushCol(): this
    pushCol(rows: number): this;

    pushRow(columns: number): this;

    value(i: number, j: number): SDNode;
    value(i: number, j: number, value: SDNode): this;

    intValue(i: number, j: number): number;

    opacity(): number;
    opacity(opacity: number): this;
    opacity(i: number, j: number): number;
    opacity(i: number, j: number, opacity: number): this;

    color(color: Color): this;
    color(i: number, j: number): Color;
    color(i: number, j: number, color: Color): Color;
}