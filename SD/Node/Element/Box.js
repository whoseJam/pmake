import { Background } from "@/Rule/Background";
import { D3Layer } from "@/Node/D3Layer";
import { ElementBase } from "./ElementBase";
import { Rect } from "@/Node/Basic/Rect";
import { SDNode } from "@/Node/Node";

/**
 * @class Box
 */
export class Box extends ElementBase {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     * @param {SDNode|null} value
     */
    constructor(node, value = null) {
        super(node);
        this.g().type("Box");
        this.children.push(
            "background",
            new Rect(this.layer("background")),
            Background())
        if (value) this.value(value);
    }
}