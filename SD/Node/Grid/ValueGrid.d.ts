import { SDNode }   from "SD/Node/SDNode";
import { D3Layer }  from "SD/Node/SDNode/D3Layer";
import { BaseGrid } from "SD/Node/Grid/BaseGrid";

export class ValueGrid extends BaseGrid {
    constructor(parent: SDNode|D3Layer);
}