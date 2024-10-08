import { Vector } from "@/Math/Math";

export class PathPen {
    MoveTo(v: Vector): this;
    MoveTo(x: number, y: number): this;
    moveTo(dv: Vector): this;
    moveTo(dx: number, dy: number): this;

    LinkTo(v: Vector): this;
    LinkTo(x: number, y: number): this;
    linkTo(dv: Vector): this;
    linkTo(dx: number, dy: number): this;

    Cubic(v1: Vector, v2: Vector, v: Vector): this;
    Cubic(x1: number, y1: number, x2: number, y2: number, x: number, y: number): this;
    cubic(dv1: Vector, dv2: Vector, dv: Vector): this;
    cubic(dx1: number, dy1: number, dx2: number, dy2: number, dx: number, dy: number): this;

    Quad(v1: Vector, v: Vector): this;
    Quad(x1: number, y1: number, x: number, y: number): this;
    quad(dv1: Vector, dv: Vector): this;
    quad(dx1: number, dy1: number, dx: number, dy: number): this;

    Arc(r: Vector, xAxisRotation: number, largeArcFlag: 0|1, sweepFlag: 0|1, v: Vector): this;
    Arc(rx: number, ry: number, xAxisRotation: number, largeArcFlag: 0|1, sweepFlag: 0|1, x: number, y: number): this;
    arc(r: Vector, xAxisRotation: number, largeArcFlag: 0|1, sweepFlag: 0|1, dv: Vector): this;
    arc(rx: number, ry: number, xAxisRotation: number, largeArcFlag: 0|1, sweepFlag: 0|1, dx: number, dy: number): this;

    toString(): string;
}