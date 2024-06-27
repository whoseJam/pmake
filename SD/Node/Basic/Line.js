import { Action } from "@/Animate/Action";
import { D3Layer } from "@/Node/D3Layer";
import { equal } from "@/Utility/Math";
import { Interp } from "@/Animate/Interp";
import { LinkBase } from "@/Node/Basic/LinkBase";
import { SDNode } from "@/Node/Node";
import { Vec } from "@/Utility/Math";

export class Line extends LinkBase {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node, "line");
        this.g().type("Line");
        const nake = this._.nake;
        nake.setAttribute("x1", this._.x1 = 0);
        nake.setAttribute("y1", this._.y1 = 0);
        nake.setAttribute("x2", this._.x2 = 40);
        nake.setAttribute("y2", this._.y2 = 40);
    }
    
    /**
     * 获取线上的k分位点
     * @param {number} k
     * @returns {[number, number]}
     */
    at(k) {
        const v1 = [this.x1(), this.y1()];
        const v2 = [this.x2(), this.y2()];
        const d = Vec.sub(v2, v1);
        return Vec.add(v1, Vec.numberMul(d, k));
    }

    /**
     * 获取线上距离起点长度length的点
     * @param {number} length 
     * @returns {[number, number]}
     */
    getPointAtLength(length) {
        const total = this.totalLength();
        const k = length / total;
        return this.at(k);
    }

    /**
     * 获取线的总长
     * @returns {number}
     */
    totalLength() {
        this.dirtyCheck("m");
        return Math.sqrt(
            (this._.x1 - this._.x2) * 
            (this._.x1 - this._.x2) + 
            (this._.y1 - this._.y2) *
            (this._.y1 - this._.y2)
        );
    }

    /**
     * @overload
     * @param {number} x 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    x1(x) {
        this.dirtyCheck("q");
        if (x === undefined) return this._.x1;
        if (equal(x, this._.x1)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.x1, x,
            Interp.numberInterp(this._.nake, "x1"),
            this, "x1"
        );
        this._.x1 = x;
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
    x2(x) {
        this.dirtyCheck("q");
        if (x === undefined) return this._.x2;
        if (equal(x, this._.x2)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.x2, x,
            Interp.numberInterp(this._.nake, "x2"),
            this, "x2"
        );
        this._.x2 = x;
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
    y1(y) {
        this.dirtyCheck("q");
        if (y === undefined) return this._.y1;
        console.log("Line set y1 = ", y, equal(y, this._.y1));
        if (equal(y, this._.y1)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.y1, y,
            Interp.numberInterp(this._.nake, "y1"),
            this, "y1"
        );
        this._.y1 = y;
        console.log("new Y1=", this._.y1);
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
    y2(y) {
        this.dirtyCheck("q");
        if (y === undefined) return this._.y2;
        if (equal(y, this._.y2)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.y2, y,
            Interp.numberInterp(this._.nake, "y2"),
            this, "y2"
        );
        this._.y2 = y;
        this.dirty(this, "R");
        return this;
    }
}