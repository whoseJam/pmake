import { Action } from "@/Animate/Action";
import { D3Layer } from "@/Node/D3Layer";
import { d3ToNake } from "@/Utility/Tool";
import { equal } from "@/Utility/Math";
import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/Node";
import { nakeToSnap } from "@/Utility/Tool";

export class BasicBase extends SDNode {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     * @param {"rect"|"circle"|"text"|"line"|"path"|"g"} tag 
     */
    constructor(node, tag) {
        super(node);
        this._.fill = "#000000";
        this._.fillOpacity = 1;
        this._.stroke = "#ffffff";
        this._.strokeOpacity = 1;
        this._.strokeWidth = 1;
        this._.strokeDashOffset = 0;
        this._.strokeDashArray = [1, 0];
        this._.selfOpacity = 1;
        this._.d3 = this.d3layer.append(tag);
        this._.nake = d3ToNake(this._.d3);
        this._.snap = nakeToSnap(this._.nake);
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
        this.dirtyCheck("q");
        if (x === undefined) return this._.x;
        if (equal(x, this._.x)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.x, x,
            Interp.numberInterp(this._.nake, "x"),
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
        this.dirtyCheck("q");
        if (y === undefined) return this._.y;
        if (equal(y, this._.y)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.y, y,
            Interp.numberInterp(this._.nake, "y"),
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
        this.dirtyCheck("q");
        if (width === undefined) return this._.width;
        if (equal(width, this._.width)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.width, width,
            Interp.numberInterp(this._.nake, "width"),
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
        this.dirtyCheck("q");
        if (height === undefined) return this._.height;
        if (equal(height, this._.height)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.height, height,
            Interp.numberInterp(this._.nake, "height"),
            this, "height"
        );
        this._.height = height;
        this.dirty(this, "R");
        return this;
    }

    /**
     * 操作元素的fill属性
     * @overload
     * @param {string} color 
     * @returns {this}
     * @overload
     * @returns {string}
     */
    fill(color) {
        this.dirtyCheck("q");
        if (color === undefined) return this._.fill;
        if (this._.fill === color) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.fill, color,
            Interp.colorInterp(this._.nake, "fill"),
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
        this.dirtyCheck("q");
        if (opacity === undefined) return this._.fillOpacity;
        if (this._.fillOpacity === opacity) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.fillOpacity, opacity,
            Interp.numberInterp(this._.nake, "fill-opacity"),
            this, "fill-opacity"
        );
        this._.fillOpacity = opacity;
        return this;
    }

    /**
     * 操作元素的stroke属性
     * @overload
     * @param {string} color 
     * @returns {this}
     * @overload
     * @returns {string}
     */
    stroke(color) {
        this.dirtyCheck("q");
        if (color === undefined) return this._.stroke;
        if (this._.stroke === color) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.stroke, color,
            Interp.colorInterp(this._.nake, "stroke"),
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
        this.dirtyCheck("q");
        if (opacity === undefined) return this._.strokeOpacity;
        if (this._.strokeOpacity === opacity) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.strokeOpacity, opacity,
            Interp.numberInterp(this._.nake, "stroke-opacity"),
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
        this.dirtyCheck("q");
        if (width === undefined) return this._.strokeWidth;
        if (this._.strokeWidth === width) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.strokeWidth, width,
            Interp.numberInterp(this._.nake, "stroke-width"),
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
        this.dirtyCheck("q");
        if (offset === undefined) return this._.strokeDashOffset;
        if (this._.strokeDashOffset === offset) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.strokeDashOffset, offset,
            Interp.numberInterp(this._.nake, "stroke-dashoffset"),
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
        this.dirtyCheck("q");
        if (array === undefined) return this._.strokeDashArray;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.strokeDashArray, array,
            Interp.arrayInterp(this._.nake, "stroke-dasharray"),
            this, "stroke-dasharray"
        );
        this._.strokeDashArray = array;
        return this;
    }

    /**
     * @overload
     * @param {string|{ main: string, border: string }} color
     * @returns {this} 
     * @overload
     * @returns {{ main: string, border: string }}
     */
    color(color) {
        if (color === undefined) return { main: this.fill(), border: this.stroke() };
        if (typeof(color) === "string") {
            this.fill(color);
            this.stroke(color);
        } else {
            this.fill(color.main);
            this.stroke(color.border);
        }
        return this;
    }
}