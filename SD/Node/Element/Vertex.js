import { Circle } from "@/Node/Basic/Circle"; 
import { CircleBackground } from "@/Rule/Background";
import { D3Layer } from "@/Node/D3Layer";
import { BaseElement } from "./BaseElement";
import { SDNode } from "@/Node/Node";
import { Vec } from "@/Utility/Math";

/**
 * @class Vertex
 */
export class Vertex extends BaseElement {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     * @param {SDNode|null} value 
     */
    constructor(node, value = null) {
        super(node);
        this.g().type("Vertex");

        this.member.new("r", 20);
        
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
        if (r === undefined) {
            return this.member.get("r");
        }
        this.member.setByEqual("r", r);
        this.tryUpdate();
        return this;
    }

    update() {
        this.preUpdate();
        super.update();
        this.postUpdate();
    }
}