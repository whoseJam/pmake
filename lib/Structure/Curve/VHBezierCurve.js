import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { Vec } from "../../Utility/Math";
import { AbsCurve } from "./AbsCurve";

export function VHBezierCurve(node) {
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
    let d = Vec.sub(v2, v1), p1, p2, pm;
    pm = Vec.add(v1, Vec.numberMul(d, 0.5));
    if (d[0] < d[1]) {
        p1 = [v1[0], v1[1] + d[1] * 0.5];
        p2 = [v2[0], v2[1] - d[1] * 0.5];
    } else {
        p1 = [v1[0] + d[0] * 0.5, v1[1]];
        p2 = [v2[0] - d[0] * 0.5, v2[1]];
    }
    return "M " + v1[0] + ", " + v1[1]
        + " Q " + p1[0] + ", " + p1[1] + ", " + pm[0] + ", " + pm[1]
        + " Q " + p2[0] + ", " + p2[1] + ", " + v2[0] + ", " + v2[1];
}