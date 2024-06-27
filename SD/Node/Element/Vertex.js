import { Circle } from "@/Node/Basic/Circle"; 
import { CircleBackground } from "@/Rule/Background";
import { D3Layer } from "@/Node/D3Layer";
import { ElementBase } from "./ElementBase";
import { SDNode } from "@/Node/Node";
import { Vec } from "@/Utility/Math";

/**
 * @class Vertex
 */
export class Vertex extends ElementBase {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     * @param {SDNode|null} value 
     */
    constructor(node, value = null) {
        super(node);
        this.g().type("Vertex");
        this._.r = 20;
        this.childAs(
            "background",
            new Circle(this.layer("background")),
            CircleBackground());
        if (value) this.value(value);
    }

    /**
     * @param {[number, number]} vec 
     * @returns {boolean}
     */
    inRange(vec) {
        const center = [this.cx(), this.cy()];
        const length = Vec.length(Vec.sub(vec, center));
        return length <= this.r();
    }

    /**
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    width(width) {
        if (width === undefined) return this.r() * 2;
        this.r(width / 2);
        return this;
    }

    /**
     * @overload
     * @param {number} height 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    height(height) {
        if (height === undefined) return this.r() * 2;
        this.r(height / 2);
        return this;
    }

    /**
     * @overload
     * @param {number} r 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    r(r) {
        this.dirtyCheck("m");
        if (r === undefined) return this._.r;
        this._.r = r;
        this.dirty(this, "U");
        return this;
    }
}