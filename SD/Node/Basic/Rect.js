import { D3Layer } from "@/Node/D3Layer";
import { SDNode } from "@/Node/Node";
import { BaseRect } from "./BaseRect";

/**
 * @class Rect
 * @description <rect>标签的代表类
 */
export class Rect extends BaseRect {
    /**
     * @constructor
     * @param {SDNode|D3Layer} parent 
     */
    constructor(parent) {
        super(parent, "rect");
        this.g().type("Rect");

        this.member.set("fill", "#ffffff");
        this.member.set("stroke", "#000000");

        const nake = this._.nake;
        nake.setAttribute("fill", this.member.get("fill"));
        nake.setAttribute("stroke", this.member.get("stroke"));
        nake.setAttribute("x", this.member.get("x"));
        nake.setAttribute("y", this.member.get("y"));
        nake.setAttribute("width", this.member.get("width"));
        nake.setAttribute("height", this.member.get("height"));
    }

 
    update() {
        this.preUpdate();
        super.update();
        this.postUpdate();
    }
}