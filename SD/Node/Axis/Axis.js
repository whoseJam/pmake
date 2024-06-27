import { Svg } from "../Basic/Svg";
import { SDNode } from "../Node";
import * as Rule from "../../Rule/Rule";
import { Color } from "../../Utility/Color";
import { Circle } from "../Basic/Circle";

export class Axis extends SDNode {
    constructor(node) {
        super(node);
        this._.x = 0;
        this._.y = 0;
        this._.width = 100;
        this._.height = 100;
        let canvas = new Svg(this);
        this.childAs("canvas", canvas, Rule.Background());
    }

    viewport(minX, maxX, minY, maxY) {
        let canvas = this.child("canvas");
        if (minX === undefined) {
            
        }
    }

    dot(x, y, r=2) {
        let canvas = this.child("canvas");
        let circ = new Circle(canvas);
        circ.r(r).cx(x).cy(y).opacity(0);
        circ.startAnimate(this);
        circ.opacity(1);
        return this;
    }
}