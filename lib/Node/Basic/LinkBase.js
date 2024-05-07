// @ts-check
import { Action } from "../../Animate/Action";
import { Base } from "./Base";
import { Context } from "../../Animate/Context";
import { Interp } from "../../Animate/Interp";
import { PointAtPathByRate } from "../../Rule/Path";
import { toNode } from "../../Utility/Tool";
import { SDNode } from "../Node";

/**
 * @typedef {"arrow"|"arrowReverse"|""} MarkerType
 */

export class LinkBase extends Base {
    /**
     * @constructor
     * @param {SDNode|import("../Node").D3Node} node 
     * @param {"line"|"path"} type 
     */
    constructor(node, type) {
        super(node, type);
        this.fillOpacity(0);
        this._.nakeMarkerStart = "";
        this._.markerStart = "";
        this._.nakeMarkerMid = "";
        this._.markerMid = "";
        this._.nakeMarkerEnd = "";
        this._.markerEnd = "";
    }
    
    /**
     * @param {number} k
     * @returns {import("../../Utility/Math").Vector}
     */
    at(k) {
        throw new Error("Not Implementd Yet");
    }
    
    /**
     * @param {number} length
     * @returns {import("../../Utility/Math").Vector} 
     */
    getPointAtLength(length) {
        throw new Error("Not Implemented Yet");
    }

    /**
     * @returns {number}
     */
    totalLength() {
        throw new Error("Not Implemented Yet");
    }

    /**
     * 操作线类元素的起点坐标
     * @overload
     * @param {number} x 
     * @param {number} y 
     * @returns {this}
     * @overload
     * @param {import("../../Utility/Math").Vector} vec
     * @returns {this}
     * @overload
     * @returns {import("../../Utility/Math").Vector} 
     */
    source(x, y) {
        // @ts-ignore
        if (arguments.length === 0) return [this.x1(), this.y1()];
        else if (arguments.length === 1) {
            let point = arguments[0];
            this.source(point[0], point[1]);
        }
        // @ts-ignore
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
     * @param {import("../../Utility/Math").Vector} vec
     * @returns {this}
     * @overload
     * @returns {import("../../Utility/Math").Vector} 
     */
    target(x, y) {
        // @ts-ignore
        if (arguments.length === 0) return [this.x2(), this.y2()];
        else if (arguments.length === 1) {
            let point = arguments[0];
            this.target(point[0], point[1]);
        }
        // @ts-ignore
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
        // @ts-ignore
        const x1 = this.x1(), x2 = this.x2();
        const ox = Math.min(x1, x2);
        if (x === undefined) return ox;
        const dx = x - ox;
        // @ts-ignore
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
        // @ts-ignore
        const y1 = this.y1(), y2 = this.y2();
        const oy = Math.min(y1, y2);
        if (y === undefined) return oy;
        const dy = y - oy;
        // @ts-ignore
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
        // @ts-ignore
        const x1 = this.x1(), x2 = this.x2();
        if (width === undefined) return Math.abs(x1 - x2);
        // @ts-ignore
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
        // @ts-ignore
        const y1 = this.y1(), y2 = this.y2();
        if (height === undefined) return Math.abs(y1 - y2);
        // @ts-ignore
        if (y1 < y2) this.y2(y1 + height); else this.y1(y2 + height);
        return this;
    }

    /**
     * 设置线类元素的值元素
     * @overload
     * @returns {any}
     * @overload
     * @param {SDNode} value 
     * @param {import("../../Rule/Rule").Rule} rule 
     * @returns {this}
     */
    value(value, rule) {
        if (value === undefined) return this.child("value");
        value = toNode(this, value);
        let ovalue = this.children.erase("value");
        if (ovalue) ovalue.opacity(0).remove();
        if (!value) return this;
        this.childAs("value", value, rule ? rule : PointAtPathByRate(0.5));
        value.opacity(0).startAnimate(this).opacity(1);
        return this;
    }

    /**
     * 设置线类元素的起点marker
     * @overload
     * @param {MarkerType} mark 
     * @returns {this}
     * @overload
     * @returns {MarkerType}
     */
    markerStart(mark) {
        if (mark === undefined) return this._.nakeMarkerStart;
        const nextMark = (mark != "") ? `url(#${mark})` : "";
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.markerStart, nextMark,
            Interp.stringInterp(this._.d3, "marker-start"),
            this, "marker-start"
        );
        this._.markerStart = nextMark;
        this._.nakeMarkerStart = mark;
        return this;
    }

    /**
     * 设置线类元素的中间点marker
     * @overload
     * @param {MarkerType} mark 
     * @returns {this}
     * @overload
     * @returns {MarkerType}
     */
    markerMid(mark) {
        if (mark === undefined) return this._.nakeMarkerMid;
        const nextMark = (mark != "") ? `url(#${mark})` : "";
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.markerMid, nextMark,
            Interp.stringInterp(this._.d3, "marker-mid"),
            this, "marker-mid"
        );
        this._.markerMid = nextMark;
        this._.nakeMarkerMid = mark;
        return this;
    }

    /**
     * 设置线类元素的终点marker
     * @overload
     * @param {MarkerType} mark 
     * @returns {this}
     * @overload
     * @returns {MarkerType}
     */
    markerEnd(mark) {
        if (mark === undefined) return this._.markerEnd;
        const nextMark = (mark != "") ? `url(#${mark})` : "";
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.markerEnd, nextMark,
            Interp.stringInterp(this._.d3, "marker-end"),
            this, "marker-end"
        );
        this._.markerEnd = nextMark;
        this._.nakeMarkerEnd = mark;
        return this;
    }

    /**
     * 给Link类元素添加末端箭头  
     * - arrow() 添加箭头
     * - arrow(true) 添加箭头
     * - arrow(null/false/undefined) 取消箭头
     * @param {boolean|null|undefined} status
     * @returns {this}
     */
    arrow(status = true) {
        if (status) this.markerEnd("arrow");
        else this.markerEnd("");
        return this;
    }

    /**
     * 给Link类元素添加前端箭头  
     * - revArrow() 添加箭头
     * - revArrow(true) 添加箭头
     * - revArrow(null/false/undefined) 取消箭头
     * @param {boolean|null|undefined} status
     * @returns {this}
     */
    revArrow(status = true) {
        if (status) this.markerStart("arrowReverse");
        else this.markerStart("");
        return this;
    }

    /**
     * 给Link类元素添加双端箭头
     * - doubleArrow() 添加箭头
     * - doubleArrow(true) 添加箭头
     * - doubleArrow(null/false/undefined) 取消箭头
     * @param {boolean|null|undefined} status 
     * @returns {this}
     */
    doubleArrow(status = true) {
        this.arrow(status);
        this.revArrow(status);
        return this;
    }

    pointStoT() {
        let len = this.totalLength();
        let context = new Context(this);
        context.till(0, 0);
        this.strokeDashArray([0, len]);
        context.till(0, 1);
        this.strokeDashArray([len, 0]);
        context.recover();
        return this;
    }

    pointTtoS() {
        let len = this.totalLength();
        let context = new Context(this);
        context.till(0, 0);
        this.strokeDashArray([len, len]);
        this.strokeDashOffset(-len);
        context.till(0, 1);
        this.strokeDashOffset(0);
        context.recover();
        return this;
    }

    fadeStoT() {
        let len = this.totalLength();
        let context = new Context(this);
        context.till(0, 0);
        this.strokeDashArray([len, len]);
        this.strokeDashOffset(0);
        context.till(0, 1);
        this.strokeDashOffset(-len);
        context.recover();
        return this;
    }

    fadeTtoS() {
        let len = this.totalLength();
        let context = new Context(this);
        context.till(0, 0);
        this.strokeDashArray([len, 0]);
        context.till(0, 1);
        this.strokeDashArray([0, len]);
        context.recover();
        return this;
    }
}