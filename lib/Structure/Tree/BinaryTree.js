import { Vertex } from "../Element/Vertex";
import { Link } from "../Link/Link";
import { AbsTree } from "./AbsTree";
import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import { SDHelper } from "../../Utility/SDHelper";
import { AbsVerticalTree } from "./AbsVerticalTree";
import { AbsElemTree } from "./AbsElemTree";

export function BinaryTree(node) {
    let self = {};
    self = Node(self, node, "BinaryTree");
    self = AbsTree(self);
    self = AbsElemTree(self);
    self = AbsVerticalTree(self);
    self.newLayer("overlay");
    self.newLayer("links");
    self.newLayer("nodes");
    self = Interact(self, self.layer("overlay"));
    self._.nodeType = Vertex;
    self._.linkType = Link;
    self._.nodeWidth = 60;
    self._.nodeHeight = 40;
    self.extWidth = SDHelper.emptyFunc;
    self.extHeight = extHeight;
    return self;
}