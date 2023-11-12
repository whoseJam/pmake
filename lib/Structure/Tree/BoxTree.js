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
    self._.layerHeight = 60;
    self._.nodeType = Vertex;
    self._.linkType = Link;
    self._.nodeWidth = 60;
    self._.nodeHeight = 40;
    self.extWidth = SDHelper.emptyFunc;
    self.extHeight = extHeight;
    self.extNewNode = extNewNode;
    self.extNewLink = SDHelper.emptyFunc;
    self.layerHeight = layerHeight;
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

function extHeight(height) {
    let hierarchy = SDHelper.treeHierarchy.call(this), div;
    if (!hierarchy || hierarchy.height === 0) div = 1;
    else div = hierarchy.height;
    this.set("layerHeight", height / div);
}


function layerHeight(height) {
    if (height === undefined)
        return this._.layerHeight;
    this._.layerHeight = height;
    let hierarchy = SDHelper.treeHierarchy.call(this);
    let dep = (hierarchy ? hierarchy.height : 1);
    this.height(height * dep);
    return this;
}

function extNewNode(node) {
    let nwidth = this.nodeWidth();
    let nheight = this.nodeHeight();
    node.width(nwidth);
    node.height(nheight);
}
