import { Vertex } from "../Element/Vertex";
import { Link } from "../Link/Link";
import { Box } from "../Element/Box";
import { AbsTree } from "./AbsTree";
import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import { SDHelper } from "../../Utility/SDHelper";
import { AbsVerticalTree } from "./AbsVerticalTree";
import { AbsD3Tree } from "./AbsD3Tree";

export function BoxTree(node) {
    let self = {};
    self = Node(self, node, "BoxTree");
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
    self._.nodeWidth = 60;
    self._.nodeHeight = 40;
    self.extNewNode = extNewNode;
    self.extNewLink = SDHelper.emptyFunc;
    self.nodeWidth = nodeWidth;
    self.nodeHeight = nodeHeight;
    
    self.width(300);
    self.nodeType(Box);
    self.linkType(Link);
    
    return self;
}

function nodeWidth(width) {
    if (width === undefined)
        return this.get("nodeWidth");
    this.set("nodeWidth", width);
    let nodes = this.get("nodes");
    for (let id in nodes)
        nodes[id].width(width);
    return this;
}

function nodeHeight(height) {
    if (height === undefined)
        return this.get("nodeHeight");
    this.set("nodeHeight", height);
    let nodes = this.get("nodes");
    for (let id in nodes)
        nodes[id].height(height);
    return this;
}

function extNewNode(node) {
    let nwidth = this.nodeWidth();
    let nheight = this.nodeHeight();
    node.width(nwidth);
    node.height(nheight);
}
