import { Node } from "../Node";
import { D3Helper } from "../../Utility/D3Helper";
import { Action } from "../../slide";
import { Interp } from "../../Animate/Interp";

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
        if (x === undefined)
            return oldViewBox;
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
}