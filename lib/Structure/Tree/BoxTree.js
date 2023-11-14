import { Vertex } from "../Element/Vertex";
import { Link } from "../Link/Link";
import { Box } from "../Element/Box";
import { AbsTree } from "./AbsTree";
import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import { SDHelper } from "../../Utility/SDHelper";
import { AbsVerticalTree } from "./AbsVerticalTree";
import { AbsD3Tree } from "./AbsD3Tree";
import { AbsElemTree } from "./AbsElemTree";

export function BoxTree(node) {
    let self = {};
    self = Node(self, node, "BoxTree");
    self = AbsTree(self);
    self = AbsD3Tree(self);
    self = AbsElemTree(self);
    self = AbsVerticalTree(self);
    self.newLayer("overlay");
    self.newLayer("links");
    self.newLayer("nodes");
    self = Interact(self, self.layer("overlay"));
    self.extNewNode = extNewNode;
    self.extNewLink = SDHelper.emptyFunc;
    self.width(300);
    self.nodeWidth(60);
    self.nodeHeight(40);
    self.nodeType(Box);
    self.linkType(Link);
    return self;
}

function extNewNode(node) {
    let nwidth = this.nodeWidth();
    let nheight = this.nodeHeight();
    node.width(nwidth);
    node.height(nheight);
}
