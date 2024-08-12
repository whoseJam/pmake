import { SDNode }   from "SD/Node/SDNode";
import { D3Layer }  from "SD/Node/SDNode/D3Layer";
import { Fragment } from "SD/Node/Nake/Fragment";

export class Mathjax extends Fragment {
    constructor(parent: SDNode|D3Layer);
    constructor(parent: SDNode|D3Layer, text: string);

    math(text: string): this;
}