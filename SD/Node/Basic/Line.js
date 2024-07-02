import { Action } from "@/Animate/Action";
import { D3Layer } from "@/Node/D3Layer";
import { equal } from "@/Utility/Math";
import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/SDNode";
import { Vec } from "@/Utility/Math";
import { BaseLink } from "./BaseLink";

export class Line extends BaseLink {
    /**
     * @constructor
     * @param {SDNode|D3Layer} parent
     */
    constructor(parent) {
        super(parent, "line");
        this.g().type("Line");

        this.member.new("x1", 0);
        this.member.new("y1", 0);
        this.member.new("x2", 40);
        this.member.new("y2", 40);

        const nake = this._.nake;
        nake.setAttribute("x1", this.member.get("x1"));
        nake.setAttribute("y1", this.member.get("y1"));
        nake.setAttribute("x2", this.member.get("x2"));
        nake.setAttribute("y2", this.member.get("y2"));
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
        const x1 = this.x1(), y1 = this.y1();
        const x2 = this.x2(), y2 = this.y2();
        return Math.sqrt(
            (x1 - x2) * (x1 - x2) +
            (y1 - y2) * (y1 - y2)
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
        if (x === undefined) {
            return this.member.get("x1");
        }
        this.member.setByEqual("x1", x);
        this.tryUpdate();
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
        if (x === undefined) {
            return this.member.get("x2");
        }
        this.member.setByEqual("x2", x);
        this.tryUpdate();
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
        if (y === undefined) {
            return this.member.get("y1");
        }
        this.member.setByEqual("y1", y);
        this.tryUpdate();
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
        if (y === undefined) {
            return this.member.get("y2");
        }
        this.member.setByEqual("y2", y);
        this.tryUpdate();
        return this;
    }

    update() {
        this.preUpdate();
        super.update();
        if (this.member.hasChanged("x1")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("x1"),
                this.member.get("x1"),
                Interp.numberInterp(this._.nake, "x1"),
                this, "x1"
            );
            this.member.flush("x1");
        }
        if (this.member.hasChanged("y1")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("y1"),
                this.member.get("y1"),
                Interp.numberInterp(this._.nake, "y1"),
                this, "y1"
            );
            this.member.flush("y1");
        }
        if (this.member.hasChanged("x2")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("x2"),
                this.member.get("x2"),
                Interp.numberInterp(this._.nake, "x2"),
                this, "x2"
            );
            this.member.flush("x2");
        }
        if (this.member.hasChanged("y2")) {
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("y2"),
                this.member.get("y2"),
                Interp.numberInterp(this._.nake, "y2"),
                this, "y2"
            );
            this.member.flush("y2");
        }
        this.postUpdate();
    }
}