import { Vertex } from "../Element/Vertex";
import { Link } from "../Link/Link";
import { Box } from "../Element/Box";
import { AbsTree, encode } from "./AbsTree";
import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import * as Tree from "./Tree";
import { SDHelper } from "../../Utility/SDHelper";

export function BinaryTree(node) {
    let self = {};
    self = Node(self, node, "BinaryTree");
    self = AbsTree(self);
    self.newLayer("overlay");
    self.newLayer("links");
    self.newLayer("nodes");
    self = Interact(self, self.layer("overlay"));
    self._.layerHeight = 60;
    self._.nodeType = Vertex;
    self._.linkType = Link;
    self._.nodeWidth = 60;
    self._.nodeHeight = 40;
    self.extWidth = SDHelper.emptyFunc;
    self.extHeight = extHeight;
    return self;
}