import { Node } from "../../Node/Node";
import { Rect } from "../Basic/Rect";
import * as Rule from "../../Rule/Rule"; 
import { Interact } from "../../Interact/Interact";
import { AbsElement } from "./AbsElement";
import { SDHelper } from "../../Utility/SDHelper";

export function Box(node) {
    let self = {};
    self = Node(self, node, "Box");
    self = AbsElement(self);
    let background = Rect(self);
    self.newLayer("overlay");
    self.newLayer("value");
    self = Interact(self, self.layer("overlay"));
    self.children.push("background", background, Rule.Background());
    self.extWidth = SDHelper.emptyFunc;
    self.extHeight = SDHelper.emptyFunc;
    return self;
}