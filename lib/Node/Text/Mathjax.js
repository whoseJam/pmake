import { Fragment } from "../Basic/Fragment";
import { Node } from "../Node";

export class Mathjax extends Node {
    constructor(node, text) {
        this.childAs(new Fragment(this));

    }
}