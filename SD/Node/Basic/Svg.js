import { Action } from "@/Animate/Action";
import { d3ToNake } from "@/Utility/Tool";
import { equal } from "@/Utility/Math";
import { Interp } from "@/Animate/Interp";
import { nakeToSnap } from "@/Utility/Tool";
import { SDNode } from "@/Node/Node";

export class Svg extends SDNode {
    constructor(node) {
        super(node);
        this.g().type("Svg");
        this.newLayer("svgElement");
        this._.d3 = this.layer("svgElement").append("svg");
        this._.nake = d3ToNake(this._.d3);
        this._.snap = nakeToSnap(this._.nake);
        this._.x = 0;
        this._.y = 0;
        this._.width = 300;
        this._.height = 300;
        this._.viewX = 0;
        this._.viewY = 0;
        this._.viewWidth = 40;
        this._.viewHeight = 40;
        const viewBoxStr = `${this._.viewX} ${this._.viewY} ${this._.viewWidth} ${this._.viewHeight}`;
        this._.nake.setAttribute("x", this._.x);
        this._.nake.setAttribute("y", this._.y);
        this._.nake.setAttribute("width", this._.width);
        this._.nake.setAttribute("height", this._.height);
        this._.nake.setAttribute("viewBox", viewBoxStr);
    }

    viewBox(x, y, width, height) {
        const viewBox = {
            viewX: this._.viewX,
            viewY: this._.viewY,
            viewWidth: this._.viewWidth,
            viewHeight: this._.viewHeight
        };
        if (x === undefined) return viewBox;
        if (equal(x, this._.viewX) && 
            equal(y, this._.viewY) &&
            equal(width, this._.viewWidth) &&
            equal(height, this._.viewHeight)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            viewBox, { viewX: x, viewY: y, viewWidth: width, viewHeight: height },
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
        this._.y =  y;
        this.dirty(this, "R");
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
        this.dirty(this, "R");
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
        this.dirty(this, "R");
        return this;
    }
}