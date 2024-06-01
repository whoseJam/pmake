import { Path } from "@/Node/Basic/Path";
import { D3Layer } from "../D3Layer";
import { SDNode } from "../Node";

/**
 * @class CurveBase
 * @description 曲线类的基类
 */
export class CurveBase extends Path {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node);
        this._.x1 = 0;
        this._.y1 = 0;
        this._.x2 = 40;
        this._.y2 = 40;
    }

    /**
     * @returns {string}
     */
    pathCalculator() {
        throw new Error("Not Implemented Yet");
    }

    /**
     * @param {number} k 
     * @returns {[number, number]}
     */
    at(k) {
        this.dirtyCheck("q");
        return super.at(k);
    }

    /**
     * @param {number} length 
     * @returns {[number, number]}
     */
    getPointAtLength(length) {
        this.dirtyCheck("q");
        return super.getPointAtLength(length);
    }

    /**
     * @returns {number}
     */
    totalLength() {
        this.dirtyCheck("q");
        return super.totalLength();
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
        this._.x1 = x;
        this.dirty(this, "U");
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
        this._.y1 = y;
        this.dirty(this, "U");
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
        this._.x2 = x;
        this.dirty(this, "U");
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
        this._.y2 = y;
        this.dirty(this, "U");
        return this;
    }

    update() {
        this.preUpdate();
        this.d(this.pathCalculator());
        this.postUpdate();
        return this;
    }
}