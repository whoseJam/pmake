import { CurveBase } from "./CurveBase";
import { Vec } from "../../Utility/Math";

export class Curve extends CurveBase {
    constructor(node) {
        super(node);
        this.g().attr("type", "Curve");
        this._.pathCalculator = pathCalculator;       
        this._.bending = 0.25;
        let curve = this.children.child("curve");
        curve.d(pathCalculator.call(this));
    }

    bending(bending) {
        this._.bending = bending;
        this.update();
        return this;
    }
}

function pathCalculator() {
    let v1 = [this.x1(), this.y1()];
    let v2 = [this.x2(), this.y2()];
    let d = Vec.sub(v2, v1);
    let dis = Vec.length(d);
    let left = Vec.norm(Vec.rotate(d, Math.PI / 2));
    let vc = Vec.add(
        Vec.add(v1, Vec.numberMul(d, 0.5)),
        Vec.numberMul(left, dis * this._.bending)
    );
    return `M ${v1[0]}, ${v1[1]} Q ${vc[0]}, ${vc[1]}, ${v2[0]}, ${v2[1]}`;
}