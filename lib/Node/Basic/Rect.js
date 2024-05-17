import { BasicBase } from "@/Node/Basic/BasicBase";
import { D3Layer } from "@/Node/D3Layer";
import { SDNode } from "@/Node/Node";

/**
 * @class Rect
 * @description <rect>标签的代表类
 */
export class Rect extends BasicBase {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node, "rect");
        this.g().type("Rect");

        const nake = this._.nake;
        nake.setAttribute("x", this._.x = 0);
        nake.setAttribute("y", this._.y = 0);
        nake.setAttribute("width", this._.width = 40);
        nake.setAttribute("height", this._.height =  40);
        nake.setAttribute("fill", this._.fill = "#ffffff");
        nake.setAttribute("stroke", this._.stroke = "#000000");
    }
}