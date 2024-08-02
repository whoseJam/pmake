import { SDNode } from "../SDNode";
import * as Rule from "../../Rule/Rule";
import { Circle } from "../Basic/Circle";
import { Line } from "../Nake/Line";

export class Coord extends SDNode {
    constructor(node) {
        super(node);
        this.childAs("xAxis", new Line(this).arrow());
        this.childAs("yAxis", new Line(this).arrow());
    }

    draw() {
        
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