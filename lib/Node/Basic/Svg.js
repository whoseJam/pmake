import { Action } from "../../Animate/Action";
import { D3Helper } from "../../Utility/D3Helper";
import { equal } from "../../Utility/Math";
import { Interp } from "../../Animate/Interp";
import { Node } from "../Node";

export class Svg extends Node {
    constructor(node) {
        super(node);
        this.g().attr("type", "Svg");
        this._.d3 = this._.group.append("svg");
        this._.basic = D3Helper.element(this._.d3);
        this._.snap = Snap(this._.basic);
        this._.x = 0;
        this._.y = 0;
        this._.width = 300;
        this._.height = 300;
        this._.viewX = 0;
        this._.viewY = 0;
        this._.viewWidth = 40;
        this._.viewHeight = 40;
        this._.d3
        .attr("x", this._.x)
        .attr("y", this._.y)
        .attr("width", this._.width)
        .attr("height", this._.height)
        .attr("viewBox", `${this._.viewX} ${this._.viewY} ${this._.viewWidth} ${this._.viewHeight}`);
        this._.group = this._.d3;
    }

    viewBox(x, y, width, height) {
        let oldViewBox = { viewX: this._.viewX, viewY: this._.viewY, viewWidth: this._.viewWidth, viewHeight: this._.viewHeight };
        if (x === undefined) return oldViewBox;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            oldViewBox, { viewX: x, viewY: y, viewWidth: width, viewHeight: height },
            Interp.viewBoxInterp(this._.d3, "viewBox"),
            this, "viewBox"
        );
        this._.viewX = x;
        this._.viewY = y;
        this._.viewWidth = width;
        this._.viewHeight = height;
        return this;
    }

    x(x) {
        let ox = this._.x;
        if (x === undefined) return ox;
        if (equal(x, ox)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.x, x,
            Interp.numberInterp(this._.d3, "x"),
            this, "x"
        );
        this._.x = x;
        return this;
    }

    y(y) {
        let oy = this._.y;
        if (y === undefined) return oy;
        if (equal(y, oy)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.y, y,
            Interp.numberInterp(this._.d3, "y"),
            this, "y"
        );
        this._.y =  y;
        return this;
    }

    width(width) {
        let ow = this._.width;
        if (width === undefined) return ow;
        if (equal(width, ow)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.width, width,
            Interp.numberInterp(this._.d3, "width"),
            this, "width"
        );
        this._.width = width;
        return this;
    }

    height(height) {
        let oh = this._.height;
        if (height === undefined) return oh;
        if (equal(height, oh)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.height, height,
            Interp.numberInterp(this._.d3, "height"),
            this, "height"
        );
        this._.height = height;
        return this;
    }
}