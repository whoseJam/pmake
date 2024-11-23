import { SDNode }   from "@/Node/SDNode";
import { BaseGrid } from "@/Node/Grid/BaseGrid";

export class Grid extends BaseGrid {
    constructor(parent: SDNode);

    axis(): "row"|"col";
    axis(axis: "row"|"col"): this;
    align(): "x"|"y"|"mx"|"my";
    align(align: "x"|"y"|"mx"|"my"): this;
}