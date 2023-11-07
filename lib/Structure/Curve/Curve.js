import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { Vec } from "../../Utility/Math";
import { AbsCurve } from "./AbsCurve";

export function Curve(node) {
    let self = {};

    self = Node(self, node, "Curve");
    self.newLayer("overlay");
    self = AbsCurve(self);
    self = Interact(self, self.layer("overlay"));
    
    self._.pathStr = pathStr;

    return self;
}

function pathStr(x1, y1, x2, y2) {
    let v1 = [x1, y1];
    let v2 = [x2, y2];
    let d = Vec.sub(v2, v1);
    let dis = Vec.length(d);
    let left = Vec.norm(Vec.rotate(d, Math.PI / 2));
    let vc = Vec.add(
        Vec.add(
            v1,
            Vec.numberMul(d, 0.5)
        ),
        Vec.numberMul(
            left,
            dis * 0.5
        )
    );
    return "M " + v1[0] + ", " + v1[1] + " Q " + vc[0] + ", " + vc[1] + ", " + v2[0] + ", " + v2[1];
}
