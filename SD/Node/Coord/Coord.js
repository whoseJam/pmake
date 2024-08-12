import { SDNode } from "../SDNode";
import { Circle } from "../Nake/Circle";
import { Line } from "../Nake/Line";
import { Path } from "../Nake/Path";
import { PathPen } from "@/Utility/PathPen";

export class Coord extends SDNode {
    constructor(node) {
        super(node);

        this.member.new("x", 0);
        this.member.new("y", 0);
        this.member.new("width", 100);
        this.member.new("height", 100);
        this.member.new("view-x", 0);
        this.member.new("view-y", 0);
        this.member.new("view-width", 5);
        this.member.new("view-height", 5);

        this.childAs("xAxis", new Line(this).arrow());
        this.childAs("yAxis", new Line(this).arrow());
    }

    draw(func) {
        const path = new Path(this);
        const pen = new PathPen();
        const width = this.member.get("width");
        for (let i = 0; i < width; i++) {
            y = func(i);
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