import { Node } from "../../Node/Node";
import * as Rule from "../../Rule/Rule";
import { Interact } from "../../Interact/Interact";
import { AbsLink } from "./AbsLink";
import { VHCurve } from "../Curve/VHCurve";

export function VHCurveLink(node) {
    let self = {};

    self = Node(self, node, "VHCurveLink");
    self = AbsLink(self);
    self.newLayer("overlay");
    self = Interact(self, self.layer("overlay"));
    
    let background = VHCurve(self);
    self.children.push(
        "background",
        background,
        Rule.Background(self, background));

    return self;
}
