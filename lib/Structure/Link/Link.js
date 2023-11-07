import { Node } from "../../Node/Node";
import { Line } from "../Basic/Line";
import * as Rule from "../../Rule/Rule";
import { Interact } from "../../Interact/Interact";
import { AbsLink } from "./AbsLink";

export function Link(node) {
    let self = {};

    self = Node(self, node, "Link");
    self = AbsLink(self);
    self.newLayer("overlay");
    self = Interact(self, self.layer("overlay"));
    
    let background = Line(self);
    self.children.push(
        "background",
        background,
        Rule.Background(self, background));

    return self;
}
