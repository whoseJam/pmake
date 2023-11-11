import { Vertex } from "../Element/Vertex";
import { Link } from "../Link/Link";
import { Box } from "../Element/Box";
import { AbsTree, encode } from "./AbsTree";
import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import * as Tree from "./Tree";
import { SDHelper } from "../../Utility/SDHelper";

export function BoxTree(node) {
    let self = {};
    
    self = Node(self, node, "BoxTree");
    self = AbsTree(self);
    self.newLayer("overlay");
    self.newLayer("links");
    self.newLayer("nodes");
    self = Interact(self, self.layer("overlay"));

    self.set("layerHeight", 50);
    self.set("links", {});
    self.set("nodes", {});
    self.set("nodeType", Vertex);
    self.set("linkType", Link);
    self.set("nodeWidth", 60);
    self.set("nodeHeight", 40);

    self.extWidth = SDHelper.emptyFunc;
    self.extHeight = Tree.extHeight;
    self.extNewNode = extNewNode;
    self.extNewLink = SDHelper.emptyFunc;
    self.layerHeight = Tree.layerHeight;
    self.nodeWidth = nodeWidth;
    self.nodeHeight = nodeHeight;
    self.update = Tree.update;
    
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
