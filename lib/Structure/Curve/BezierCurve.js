import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node_";
import { Vec } from "../../Utility/Math";
import { AbsCurve } from "./AbsCurve";

export function BezierCurve(node) {
    let self = {};

    self = Node(self, node, "VHBezierCurve");
    self.newLayer("overlay");
    self = Interact(self, self.layer("overlay"));
    self = AbsCurve(self);

    self._.pathStr = pathStr;

    return self;
}

function pathStr(x1, y1, x2, y2) {
    let v1 = [x1, y1];
    let v2 = [x2, y2];
    let d = Vec.sub(v2, v1);
    let d1q = Vec.numberMul(d, 0.25);
    let d3q = Vec.numberMul(d, 0.75);
    let pc1 = Vec.add(Vec.add(v1, d1q), Vec.rotate(d1q, Math.PI / 2));
    let pm = Vec.add(v1, Vec.numberMul(d, 0.5));
    let pc2 = Vec.add(Vec.add(v1, d3q), Vec.rotate(d1q, -Math.PI / 2));
    return "M " + v1[0] + ", " + v1[1]
        + " Q " + pc1[0] + ", " + pc1[1] + ", " + pm[0] + ", " + pm[1]
        + " Q " + pc2[0] + ", " + pc2[1] + ", " + v2[0] + ", " + v2[1];
}