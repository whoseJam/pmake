import { Background } from "@/Rule/Background";
import { D3Layer } from "@/Node/D3Layer";
import { BaseElement } from "./BaseElement";
import { Rect } from "@/Node/Basic/Rect";
import { SDNode } from "@/Node/SDNode";

/**
 * @class Box
 */
export class Box extends BaseElement {
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

    update() {
        this.preUpdate();
        super.update();
        this.postUpdate();
    }
}