import { Action } from "../../Animate/Action";
import { Color } from "../../Utility/Color";
import { Const } from "../../Utility/Const";
import { D3Helper } from "../../Utility/D3Helper";
import { equal } from "../../Utility/Math";
import { Interp } from "../../Animate/Interp";
import { Node } from "../Node";

export class Base extends Node {
    constructor(node, type) {
        let mode = "normal";
        let svg = node;
        if (node.hsj !== undefined) {
            mode = node.mode ? node.mode : mode;
            svg = node.svg;
        }
        super(svg);
        this._.fill = Color.white;
        this._.fillOpacity = 1;
        this._.stroke = Color.black;
        this._.strokeOpacity = 1;
        this._.strokeWidth = 1;
        this._.strokeDashOffset = 0;
        this._.strokeDashArray = [1, 0];
        this._.selfOpacity = 1;
        this._.d3 = this._.group
            .append(type)
            .attr("fill", this._.fill)
            .attr("fill-opacity", this._.fillOpacity)
            .attr("stroke", this._.stroke)
            .attr("stroke-opacity", this._.strokeOpacity)
            .attr("opacity", this._.opacity)
            .attr("stroke-dashoffset", this._.strokeDashOffset)
            .attr("stroke-dasharray", this._.strokeDashArray);
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

        this._.nake = D3Helper.element(this._.d3);
        this._.snap = Snap(this._.nake);

        this.clickable(false);
    }
    
    fill(color) {
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

    fillOpacity(opacity) {
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

    stroke(color) {
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

    strokeOpacity(opacity) {
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

    strokeWidth(width) {
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
    
    strokeDashOffset(offset) {
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

    strokeDashArray(array) {
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

    color(color) {
        if (color === undefined) return { main: this.fill(), border: this.stroke() };
        if (typeof(color) === "string") this.fill(color);
        else if(typeof(color) === "object") {
            this.fill(color.main);
            this.stroke(color.border);
        } else console.error(color);
        return this;
    }

    selfOpacity(opacity) {
        if (opacity === undefined) return this._.selfOpacity;
        if (this._.opacity === opacity) return this;
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

    clickable(isClickable) {
        let d3 = this._.d3;
        d3.style("pointer-events", 
            isClickable ? "auto" : "none"
        );
        return this;
    }

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
        this.dirty();
        return this;
    }

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
        this.dirty();
        return this;
    }

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
        this.dirty();
        return this;
    }

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
        this.dirty();
        return this;
    }
}