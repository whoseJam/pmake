import { Node } from "../../Node/Node_";
import { Polyline } from "../../Structure/Basic/Polyline";
import { AbsPolygen } from "./AbsPolygen";
import * as Rule from "../../Rule/Rule";
import { Interact } from "../../Interact/Interact";
import { SDHelper } from "../../Utility/SDHelper";
import { Vec } from "../../Utility/Math";

export function Triangle(node) {
    let self = {};
    self = Node(self, node, "Triangle");
    let inner = Polyline(self);
    inner.points([0, 40, 40, 40, 20, 0, 0, 40]);
    self.newLayer("overlay");
    self = AbsPolygen(self);
    self = Interact(self, self.layer("overlay"));
    self.children.push("inner", inner, Rule.Background())
    self.update = SDHelper.emptyFunc;
    self.inRange = inRange;
    return self;
}

function inRange(vec) {
    let minX = this.x(), maxX = this.mx(), midX = this.cx;
    let minY = this.y(), maxY = this.my();
    if (vec[0] < minX || vec[0] > maxX) return false;
    if (minX <= vec[0] && vec[0] < midX) {
        let A = [minX, maxY];
        let B = [midX, minY];
        let C = [maxX, maxY];
        let v1 = Vec.sub(B, A);
        let v2 = Vec.sub(C, A);
        let vm = Vec.sub(vec, A);
        if (!(Vec.onLeft(vm, v1) && Vec.onRight(vm, v2))) return false;
    } else {
        let A = [minX, maxY];
        let B = [midX, minY];
        let C = [maxX, maxY];
        let v1 = Vec.sub(B, C);
        let v2 = Vec.sub(A, C);
        let vm = Vec.sub(vec, C);
        if (!(Vec.onRight(vm, v1) && Vec.onLeft(vm, v2))) return false;
    }
    return true;
}