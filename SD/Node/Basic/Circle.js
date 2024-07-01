import { Action } from "@/Animate/Action";
import { BasicBase } from "@/Node/Basic/BasicBase";
import { D3Layer } from "@/Node/D3Layer";
import { equal } from "@/Utility/Math";
import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/Node";
import { Vec } from "@/Utility/Math";

/**
 * @class Circle
 * @description <circle>标签的代表类
 */
export class Circle extends BasicBase {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node, "circle");
        this.g().type("Circle");

        const nake = this._.nake;
        nake.setAttribute("cx", this._.cx = 20); this._.x = 0;
        nake.setAttribute("cy", this._.cy = 20); this._.y = 0;
        nake.setAttribute("r", this._.r = 20);
        nake.setAttribute("fill", this._.fill = "#ffffff");
        nake.setAttribute("stroke", this._.stroke = "#000000");
    }

    /**
     * 判断vec是否落在元素范围内
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
     * @param {number} x 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    cx(x) {
        if (x === undefined) return this._.cx;
        if (equal(x, this._.cx)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.cx, x,
            Interp.numberInterp(this._.nake, "cx"),
            this, "cx"
        );
        this._.cx = x;
        this._.x = x - this._.r;
        this.dirty(this, "R");
        return this;
    }

    /**
     * @overload
     * @param {number} y 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    cy(y) {
        this.dirtyCheck("q");
        if (y === undefined) return this._.cy;
        if (equal(y, this._.cy)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.cy, y,
            Interp.numberInterp(this._.nake, "cy"),
            this, "cy"
        );
        this._.cy = y;
        this._.y = y - this._.r;
        this.dirty(this, "R");
        return this;
    }
    
    /**
     * @overload
     * @param {number} x
     * @returns {this}
     * @overload
     * @returns {number}
     */
    x(x) {
        if (x === undefined) return this.cx() - this.r();
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
        if (y === undefined) return this.cy() - this.r();
        return this.cy(this.cy() + y - this.y());
    }

    /**
     * 设置元素的半径
     * @overload
     * @param {number} r 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    r(r) {
        this.dirtyCheck("q");
        if (r === undefined) return this._.r;
        if (equal(r, this._.r)) return this;
        const x = this.x();
        const y = this.y();
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.r, r,
            Interp.numberInterp(this._.nake, "r"),
            this, "r"
        );
        this._.x = x + r - this._.r;
        this._.y = y + r - this._.y;
        this._.r = r;
        this.x(x);
        this.y(y);
        this.dirty(this, "R");
        return this;
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
        if (width === undefined) return this.r() * 2;
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
        if (height === undefined) return this.r() * 2;
        return this.r(height / 2);
    }
}