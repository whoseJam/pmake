import { Action } from "../../Animate/Action";
import { Color } from "../../Utility/Color";
import { equal } from "../../Utility/Math";
import { Interp } from "../../Animate/Interp";
import { SDNode } from "../Node";
import { d3ToNake } from "../../Utility/Tool";
import { D3Layer } from "../D3Layer";

/**
 * @class Base
 * @description 基础元素的基类
 */
export class Base extends SDNode {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     * @param {"rect"|"circle"|"text"|"line"|"path"} type 
     */
    constructor(node, type) {
        super(node);
        this._.fill = Color.white;
        this._.fillOpacity = 1;
        this._.stroke = Color.black;
        this._.strokeOpacity = 1;
        this._.strokeWidth = 1;
        this._.strokeDashOffset = 0;
        this._.strokeDashArray = [1, 0];
        this._.selfOpacity = 1;
        this._.d3 = this.d3layer
            .append(type)
            .attr("fill", this._.fill)
            .attr("fill-opacity", this._.fillOpacity)
            .attr("stroke", this._.stroke)
            .attr("stroke-opacity", this._.strokeOpacity)
            .attr("opacity", this._.opacity)
            .attr("stroke-dashoffset", this._.strokeDashOffset)
            .attr("stroke-dasharray", this._.strokeDashArray);
        console.log("D3=", this._.d3);
        if (type === "rect") {
            this._.x = 0;
            this._.y = 0;
            this._.width = 40;
            this._.height = 40;
            this._.d3
            .attr("x", this._.x)
            .attr("y", this._.y)
            .attr("width", this._.width)
            .attr("height", this._.height)
        } else if (type === "circle") {
            this._.cx = 20;
            this._.cy = 20;
            this._.r = 20;
            this._.d3
            .attr("cx", this._.cx)
            .attr("cy", this._.cy)
            .attr("r", this._.r);
        } else if (type === "text") {
            this._.x = 0;
            this._.y = 0;
        } else if (type === "line") {
            this._.x1 = 0;
            this._.y1 = 0;
            this._.x2 = 40;
            this._.y2 = 40;
            this._.d3
            .attr("x1", this._.x1)
            .attr("y1", this._.y1)
            .attr("x2", this._.x2)
            .attr("y2", this._.y2);
        }
        this._.nake = d3ToNake(this._.d3);
        this._.snap = Snap(this._.nake);
        this.clickable(false);
    }

    /**
     * 操作元素的fill属性
     * @overload
     * @param {import("../../Utility/Color").SDColor} color 
     * @returns {this}
     * @overload
     * @returns {import("../../Utility/Color").SDUnpackedColor}
     */
    fill(color) {
        this.dirtyCheck();
        if (color === undefined) return this._.fill;
        if (this._.fill === color) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.fill, color,
            Interp.colorInterp(this._.d3, "fill"),
            this, "fill"
        );
        this._.fill = color;
        return this;
    }
    /**
     * 操作元素的fill-opacity属性
     * @overload
     * @param {number} opacity 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    fillOpacity(opacity) {
        this.dirtyCheck();
        if (opacity === undefined) return this._.fillOpacity;
        if (this._.fillOpacity === opacity) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.fillOpacity, opacity,
            Interp.numberInterp(this._.d3, "fill-opacity"),
            this, "fill-opacity"
        );
        this._.fillOpacity = opacity;
        return this;
    }

    /**
     * 操作元素的stroke属性
     * @overload
     * @param {import("../../Utility/Color").SDUnpackedColor} color 
     * @returns {this}
     * @overload
     * @returns {import("../../Utility/Color").SDUnpackedColor}
     */
    stroke(color) {
        this.dirtyCheck();
        if (color === undefined) return this._.stroke;
        if (this._.stroke === color) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.stroke, color,
            Interp.colorInterp(this._.d3, "stroke"),
            this, "stroke"
        );
        this._.stroke = color;
        return this;
    }

    /**
     * 操作元素的stroke-opacity属性
     * @overload
     * @param {number} opacity 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    strokeOpacity(opacity) {
        this.dirtyCheck();
        if (opacity === undefined) return this._.strokeOpacity;
        if (this._.strokeOpacity === opacity) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.strokeOpacity, opacity,
            Interp.numberInterp(this._.d3, "stroke-opacity"),
            this, "stroke-opacity"
        );
        this._.strokeOpacity = opacity;
        return this;
    }

    /**
     * 操作元素的stroke-width属性
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    strokeWidth(width) {
        this.dirtyCheck();
        if (width === undefined) return this._.strokeWidth;
        if (this._.strokeWidth === width) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.strokeWidth, width,
            Interp.numberInterp(this._.d3, "stroke-width"),
            this, "stroke-width"
        );
        this._.strokeWidth = width;
        return this;
    }
    
    /**
     * 操作元素的stroke-dashoffset属性
     * @overload
     * @param {number} offset 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    strokeDashOffset(offset) {
        this.dirtyCheck();
        if (offset === undefined) return this._.strokeDashOffset;
        if (this._.strokeDashOffset === offset) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.strokeDashOffset, offset,
            Interp.numberInterp(this._.d3, "stroke-dashoffset"),
            this, "stroke-dashoffset"
        );
        this._.strokeDashOffset = offset;
        return this;
    }

    /**
     * 操作元素的stroke-dasharray属性
     * @overload
     * @param {Array<number>} array 
     * @returns {this}
     * @overload
     * @returns {Array<number>}
     */
    strokeDashArray(array) {
        this.dirtyCheck();
        if (array === undefined) return this._.strokeDashArray;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.strokeDashArray, array,
            Interp.arrayInterp(this._.d3, "stroke-dasharray"),
            this, "stroke-dasharray"
        );
        this._.strokeDashArray = array;
        return this;
    }

    d3() {
        return this._.d3;
    }

    snap() {
        return this._.snap;
    }

    nake() {
        return this._.nake;
    }

    /**
     * 操作元素的颜色
     * @overload
     * @param {import("../../Utility/Color").SDColor} color 
     * @returns {this}
     * @overload
     * @returns {import("../../Utility/Color").SDPackedColor}
     */
    color(color) {
        if (color === undefined) return { main: this.fill(), border: this.stroke() };
        if (typeof(color) === "string") this.fill(color);
        else if(typeof(color) === "object") {
            this.fill(color.main);
            this.stroke(color.border);
        } else console.error(color);
        return this;
    }

    /**
     * 操作内部基础元素的透明度
     * @overload
     * @param {number} opacity 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    selfOpacity(opacity) {
        this.dirtyCheck();
        if (opacity === undefined) return this._.selfOpacity;
        if (this._.selfOpacity === opacity) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.opacity, opacity,
            Interp.numberInterp(this._.d3, "opacity"),
            this, "self-opacity"
        )
        this._.selfOpacity = opacity;
        return this;
    }

    /**
     * 设置元素是否能点击
     * @param {true|false} status 
     * @returns 
     */
    clickable(status) {
        const statusStr = status ? "auto" : "none";
        this._.d3.style("pointer-events", statusStr);
        return this;
    }

    /**
     * 操作元素的x坐标
     * @overload
     * @param {number} x
     * @returns {this}
     * @overload
     * @returns {number}
     */
    x(x) {
        this.dirtyCheck();
        if (x === undefined) return this._.x;
        if (equal(x, this._.x)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.x, x,
            Interp.numberInterp(this._.d3, "x"),
            this, "x"
        );
        this._.x = x;
        this.dirty(this, "R");
        return this;
    }

    /**
     * 操作元素的y坐标
     * @overload
     * @param {number} y 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    y(y) {
        this.dirtyCheck();
        if (y === undefined) return this._.y;
        if (equal(y, this._.y)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.y, y,
            Interp.numberInterp(this._.d3, "y"),
            this, "y"
        );
        this._.y = y;
        this.dirty(this, "R");
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
        this.dirtyCheck();
        if (width === undefined) return this._.width;
        if (equal(width, this._.width)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.width, width,
            Interp.numberInterp(this._.d3, "width"),
            this, "width"
        );
        this._.width = width;
        this.dirty(this, "R");
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
        this.dirtyCheck();
        if (height === undefined) return this._.height;
        if (equal(height, this._.height)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.height, height,
            Interp.numberInterp(this._.d3, "height"),
            this, "height"
        );
        this._.height = height;
        this.dirty(this, "R");
        return this;
    }
}