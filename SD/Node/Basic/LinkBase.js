import { PointAtPathByRate } from "@/Rule/Path";
import { toNode } from "@/Utility/Tool";
import { SDNode } from "@/Node/SDNode";
import { PathBase } from "@/Node/Basic/PathBase";

/**
 * @class LinkBase
 */
export class LinkBase extends PathBase {
    /**
     * @constructor
     * @param {SDNode} node 
     * @param {"line"|"path"|"polyline"} type 
     */
    constructor(node, tag) {
        super(node, tag);
        this._.valueRule = undefined;
    }
    
    /**
     * 操作线类元素的起点坐标
     * @overload
     * @param {number} x 
     * @param {number} y 
     * @returns {this}
     * @overload
     * @param {[number, number]} vec
     * @returns {this}
     * @overload
     * @returns {[number, number]} 
     */
    source(x, y) {
        if (arguments.length === 0) return [this.x1(), this.y1()];
        else if (arguments.length === 1) {
            const point = arguments[0];
            this.source(point[0], point[1]);
        }
        this.x1(x).y1(y);
        return this;
    }

    /**
     * 操作线类元素的终点坐标
     * @overload
     * @param {number} x 
     * @param {number} y 
     * @returns {this}
     * @overload
     * @param {[number, number]} vec
     * @returns {this}
     * @overload
     * @returns {[number, number]} 
     */
    target(x, y) {
        if (arguments.length === 0) return [this.x2(), this.y2()];
        else if (arguments.length === 1) {
            const point = arguments[0];
            this.target(point[0], point[1]);
        }
        this.x2(x).y2(y);
        return this;
    }

    /**
     * 操作元素的x属性
     * @overload
     * @param {number} x 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    x(x) {
        const x1 = this.x1(), x2 = this.x2();
        const ox = Math.min(x1, x2);
        if (x === undefined) return ox;
        const dx = x - ox;
        this.x1(x1 + dx).x2(x2 + dx);
        return this;
    }

    /**
     * 操作元素的y属性
     * @overload
     * @param {number} y 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    y(y) {
        const y1 = this.y1(), y2 = this.y2();
        const oy = Math.min(y1, y2);
        if (y === undefined) return oy;
        const dy = y - oy;
        this.y1(y1 + dy).y2(y2 + dy);
        return this;
    }

    /**
     * 操作元素的width属性
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    width(width) {
        const x1 = this.x1(), x2 = this.x2();
        if (width === undefined) return Math.abs(x1 - x2);
        if (x1 < x2) this.x2(x1 + width); else this.x1(x2 + width);
        return this;
    }

    /**
     * 操作元素的height属性
     * @overload
     * @param {number} height 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    height(height) {
        const y1 = this.y1(), y2 = this.y2();
        if (height === undefined) return Math.abs(y1 - y2);
        if (y1 < y2) this.y2(y1 + height); else this.y1(y2 + height);
        return this;
    }

    /**
     * 设置线类元素的值元素
     * @overload
     * @returns {any}
     * @overload
     * @param {SDNode} value
     * @returns {this}
     * @overload
     * @param {SDNode} value 
     * @param {(SDNode, SDNode) => void} rule 
     * @returns {this}
     */
    value(value, rule) {
        if (value === undefined) return this.child("value");
        value = toNode(this, value);
        let ovalue = this.children.erase("value");
        if (ovalue) ovalue.opacity(0).remove();
        if (!value) return this;
        this.childAs("value", value, rule ? rule : PointAtPathByRate(0.5));
        value._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        }
        this.dirty(this, "U");
        return this;
    }

    /**
     * @returns {number}
     */
    intValue() {
        const value = this.child("value");
        if (!value) return 0;
        return +value.text();
    }

    rule(rule) {
        const child = this.child("value");
        this._.valueRule = rule;
        child._.rule = rule;
        this.dirty(this, "R");
        return this;
    }
}