import { Vertex } from "../Element/Vertex";
import { Link } from "../Link/Link";
import { AbsTree } from "./AbsTree";
import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import { SDHelper } from "../../Utility/SDHelper";
import { AbsD3Tree } from "./AbsD3Tree";
import { AbsVerticalTree } from "./AbsVerticalTree";

export function Tree(node) {
    let self = {};
    self = Node(self, node, "Tree");
    self = AbsTree(self);
    self = AbsD3Tree(self);
    self = AbsVerticalTree(self);
    self.newLayer("overlay");
    self.newLayer("links");
    self.newLayer("nodes");
    self = Interact(self, self.layer("overlay"));
    self._.layerHeight = 60;
    self._.nodeType = Vertex;
    self._.linkType = Link;
    self.extNewNode = extNewNode;
    self.extNewLink = SDHelper.emptyFunc;
    self.r = r;
    self.width(300);
    self.nodeType(Vertex);
    self.linkType(Link);
    return self;
}

function r(r) {
    if (r === undefined)
        return this.get("r");
    this.set("r", r);
    let nodes = this.get("nodes");
    for (let id in nodes)
        nodes[id].width(r * 2);
    return this;
}

function extNewNode(node) {
    let r = this._.r;
    if (node.node.r) {
        node.node.r(r);
    } else {
        node.node.width(r * 2);
        node.node.height(r * 2);
    }
}