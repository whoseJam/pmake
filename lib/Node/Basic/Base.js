import { D3Helper } from "../../Utility/D3Helper";
import { Action } from "../../Animate/Action";
import { Interp } from "../../Animate/Interp";
import { Color } from "../../Utility/Color";
import { Node } from "../Node";
import { timeout } from "d3";
import { equal } from "../../Utility/Math";

export class Base extends Node {
    constructor(conf, type) {
        let mode = "normal";
        let svg = conf;
        if (conf.hsj !== undefined) {
            mode = conf.mode ? conf.mode : mode;
            svg = conf.svg;
        }

        super(svg);
        this._.fill = Color.white;
        this._.fillOpacity = 1;
        this._.stroke = Color.black;
        this._.strokeOpacity = 1;
        this._.strokeWidth = 1;
        this._.opacity = 1;
        this._.d3 = this._.group
            .append(type)
            .attr("fill", this._.fill)
            .attr("fill-opacity", this._.fillOpacity)
            .attr("stroke", this._.stroke)
            .attr("stroke-opacity", this._.strokeOpacity)
            .attr("opacity", this._.opacity);
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

        this._.basic = D3Helper.element(this._.d3);
        this._.snap = Snap(this._.basic);

        this.clickable(false);
    }
    
    fill(color) {
        if (color === undefined)
            return this._.fill;
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
        if (opacity === undefined)
            return this._.fillOpacity;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.fillOpacity, opacity,
            Interp.numberInterp(this._.d3, "fill-opacity"),
            this, "fill-opacity"
        );
        this._.fillOpacity = opacity;
    }

    stroke(color) {
        if (color === undefined)
            return this._.stroke;
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
        if (opacity === undefined)
            return this._.strokeOpacity;
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
        if (width === undefined)
            return this._.strokeWidth;
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

    basic() {
        return this._.d3;
    }

    remove() {
        let This = this;
        let group = this._.group;
        if (this.delay() + this.duration() >= 100) {
            timeout(function() {
                group.remove();
                timeout(function() {
                    for (let key in This)
                        delete This[key];
                }, 1000)
            }, this.delay() + this.duration() - 100)
        } else {
            group.remove();
            for (let key in This)
                delete this[key];
        }
    }

    color(color) {
        if (color === undefined)
            return { main: this.fill(), border: this.stroke() };
        if (typeof(color) === "string")
            this.fill(color);
        else if(typeof(color) === "object") {
            this.fill(color.main);
            this.stroke(color.border);
        } else throw new Error(`不合法的color：${color}`);
        return this;
    }

    opacity(opacity) {
        if (opacity === undefined)
            return this._.opacity;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.opacity, opacity,
            Interp.numberInterp(this._.d3, "opacity"),
            this, "opacity"
        )
        this._.opacity = opacity;
        super.opacity(opacity);
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
        let ox = this._.x;
        if (x === undefined)
            return ox;
        if (equal(x, ox)) return this;
        this.dirty();
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.x, x,
            Interp.numberInterp(this._.d3, "x"),
            this, "x"
        );
        this._.x = x;
        this.children.update();
        return this;
    }

    y(y) {
        let oy = this._.y;
        if (y === undefined)
            return oy;
        if (equal(y, oy)) return this;
        this.dirty();
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.y, y,
            Interp.numberInterp(this._.d3, "y"),
            this, "y"
        );
        this._.y = y;
        this.children.update();
        return this;
    }

    width(width) {
        let ow = this._.width;
        if (width === undefined)
            return ow;
        if (equal(width, ow)) return this;
        this.dirty();
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.width, width,
            Interp.numberInterp(this._.d3, "width"),
            this, "width"
        );
        this._.width = width;
        this.children.update();
        return this;
    }

    height(height) {
        let oh = this._.height;
        if (height === undefined)
            return oh;
        if (equal(height, oh)) return this;
        this.dirty();
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.height, height,
            Interp.numberInterp(this._.d3, "height"),
            this, "height"
        );
        this._.height = height;
        this.children.update();
        return this;
    }
}