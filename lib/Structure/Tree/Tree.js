import { AbsTree } from "./AbsTree";
import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import { SDHelper } from "../../Utility/SDHelper";
import { AbsD3Tree } from "./AbsD3Tree";
import { AbsVerticalTree } from "./AbsVerticalTree";
import { AbsElemTree } from "./AbsElemTree";

export function Tree(node) {
    let self = {};
    self = Node(self, node, "Tree");
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
    self.r(20);
    self.width(300);
    return self;
}

function extNewNode(node) {
    // let r = this.r();
    // if (node.r) {
    //     node.r(r);
    // } else {
    //     node.width(r * 2);
    //     node.height(r * 2);
    // }
}