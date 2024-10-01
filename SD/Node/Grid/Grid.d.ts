import { SDNode }   from "SD/Node/SDNode";
import { D3Layer }  from "SD/Node/SDNode/D3Layer";
import { BaseGrid } from "SD/Node/Grid/BaseGrid";

export class Grid extends BaseGrid {
    constructor(parent: SDNode|D3Layer);

    axis(): "row"|"col";
    axis(axis: "row"|"col"): this;
    align(): "x"|"y"|"mx"|"my";
    align(align: "x"|"y"|"mx"|"my"): this;
}