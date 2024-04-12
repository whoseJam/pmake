import { CurveBase } from "./CurveBase";
import { Vec } from "../../Utility/Math";

export class Brace extends CurveBase {
    constructor(node) {
        super(node);
        this.g().attr("type", "Brace");
        this._.bending = 5;
        this._.pathCalculator = pathCalculator;
    }
}

function pathCalculator() {
    let vs = [this.x1(), this.y1()];
    let vt = [this.x2(), this.y2()];
    let vc = Vec.numberMul(Vec.add(vs, vt), 0.5)
    let d = Vec.numberMul(Vec.norm(Vec.sub(vt, vs)), this._.bending);
    let dl = Vec.rotate(d, -Math.PI/2);
    let p1 = Vec.add(vs, dl);
    let p2 = Vec.add(p1, d);
    let c2 = Vec.add(vc, dl);
    let c1 = Vec.sub(c2, d);
    let c3 = Vec.add(c2, d);
    let c = Vec.add(c2, dl);
    let p4 = Vec.add(vt, dl);
    let p3 = Vec.sub(p4, d);
    return `M ${vs[0]}, ${vs[1]} Q ${p1[0]}, ${p1[1]}, ${p2[0]}, ${p2[1]} `
         + `L ${c1[0]}, ${c1[1]} Q ${c2[0]}, ${c2[1]}, ${c[0]}, ${c[1]} Q ${c2[0]}, ${c2[1]} ${c3[0]}, ${c3[1]} `
         + `L ${p3[0]}, ${p3[1]} Q ${p4[0]}, ${p4[1]}, ${vt[0]}, ${vt[1]}`;
}