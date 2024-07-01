import { Action } from "@/Animate/Action";
import { BaseNake } from "@/Node/Basic/BaseNake";
import { Context } from "@/Animate/Context";
import { D3Layer } from "@/Node/D3Layer";
import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/Node";

/**
 * @class PathBase
 */
export class PathBase extends BaseNake {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node
     * @param {"line"|"path"|"polyline"} tag 
     */
    constructor(node, tag) {
        super(node, tag);
        const nake = this._.nake;
        nake.setAttribute("fill-opacity", this._.fillOpacity = 0);
        nake.setAttribute("stroke-opacity", this._.strokeOpacity = 1);
        nake.setAttribute("stroke-width", this._.strokeWidth = 1);
        nake.setAttribute("stroke", this._.stroke = "#000000");
        this._.nakeMarkerStart = "";
        this._.markerStart = "";
        this._.nakeMarkerMid = "";
        this._.markerMid = "";
        this._.nakeMarkerEnd = "";
        this._.markerEnd = "";
    }

    /**
     * @param {number} k
     * @returns {[number, number]} 
     */
    at(k) {
        throw new Error("Not Implemented Yet");
    }

    /**
     * @param {number} length
     * @returns {[number, number]} 
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
            Interp.stringInterp(this._.nake, "marker-start"),
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
            Interp.stringInterp(this._.nake, "marker-mid"),
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
            Interp.stringInterp(this._.nake, "marker-end"),
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