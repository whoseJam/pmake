import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { AbsCurve } from "./AbsCurve";

export function CircleCurve(node) {
    let self = {};
    self = Node(self, node, "CircleCurve");
    self.newLayer("overlay");
    self = AbsCurve(self);
    self = Interact(self, self.layer("overlay"));
    self.r = r;
    self._.pathStr = pathStr;
    self._.r = 30;
    return self;
}

function r(r) {
    this._.r = r;

}