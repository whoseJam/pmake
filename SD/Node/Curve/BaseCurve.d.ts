import { Path }    from "SD/Node/Nake/Path";
import { SDNode }  from "SD/Node/SDNode";
import { D3Layer } from "SD/Node/SDNode/D3Layer";

export class BaseCurve extends Path {
    constructor(parent: SDNode|D3Layer);
}