import { D3Layer } from "@/Node/D3Layer";
import { SDNode } from "@/Node/SDNode";
import { BaseCircle } from "./BaseCircle";

/**
 * @class Circle
 * @description <circle>标签的代表类
 */
export class Circle extends BaseCircle {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node, "circle");
        this.g().type("Circle");

        this.member.set("fill", "#ffffff");
        this.member.set("stroke", "#000000");
        this.member.new("cx", 20);
        this.member.new("cy", 20);
        this.member.new("r", 20);
        
        const nake = this._.nake;
        nake.setAttribute("fill", this.member.get("fill"));
        nake.setAttribute("stroke", this.member.get("stroke"));
        nake.setAttribute("cx", this.member.get("cx"));
        nake.setAttribute("cy", this.member.get("cy"));
        nake.setAttribute("r", this.member.get("r"));
    }

    /**
     * @overload
     * @param {number} x
     * @returns {this}
     * @overload
     * @returns {number}
     */
    x(x) {
        if (x === undefined) {
            return this.cx() - this.r();
        }
        return this.cx(this.cx() + x - this.x());
    }

    /**
     * @overload
     * @param {number} y 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    y(y) {
        if (y === undefined) {
            return this.cy() - this.r();
        }
        return this.cy(this.cy() + y - this.y());
    }

    /**
     * 操作元素的width
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    width(width) {
        if (width === undefined) {
            return this.r() * 2;
        }
        return this.r(width / 2);
    }

    /**
     * 操作元素的height
     * @overload
     * @param {number} height 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    height(height) {
        if (height === undefined) {
            return this.r() * 2;
        }
        return this.r(height / 2);
    }
}