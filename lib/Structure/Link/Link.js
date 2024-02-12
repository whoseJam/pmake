import { Node } from "../../Node/Node_";
import { Line } from "../Basic/Line";
import * as Rule from "../../Rule/Rule";
import { Interact } from "../../Interact/Interact";
import { AbsLink } from "./AbsLink";

export function Link(node) {
    let self = {};
    self = Node(self, node, "Link");
    let background = Line(self);
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
