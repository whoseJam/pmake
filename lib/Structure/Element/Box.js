import { Node } from "../../Node/Node";
import { Rect } from "../Basic/Rect";
import * as Rule from "../../Rule/Rule"; 
import { Interact } from "../../Interact/Interact";
import { AbsElement } from "./AbsElement";

export function Box(node) {
    let self = {};

    self = Node(self, node, "Box");
    self = AbsElement(self);
    self.newLayer("background");
    self.newLayer("overlay");
    self.newLayer("value");
    self = Interact(self, self.layer("overlay"));
    
    let background = Rect(self.layer("background"));
    self.children.push(
        "background",
        background,
        Rule.Background(self, background));

    self.extWidth = () => {};
    self.extHeight = () => {};
    
    return self;
}