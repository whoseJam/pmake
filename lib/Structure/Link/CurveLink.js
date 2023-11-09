import { Node } from "../../Node/Node";
import * as Rule from "../../Rule/Rule";
import { Interact } from "../../Interact/Interact";
import { AbsLink } from "./AbsLink";
import { Curve } from "../Curve/Curve";

export function CurveLink(node) {
    let self = {};
    self = Node(self, node, "CurveLink");
    let background = Curve(self);
    self.children.push(
        "background",
        background,
        Rule.Background(self, background));
    self = AbsLink(self);
    self.newLayer("value");
    self.newLayer("overlay");
    self = Interact(self, self.layer("overlay"));
    return self;
}