import { Vertex } from "../Element/Vertex";
import { Link } from "../Link/Link";
import { Box } from "../Element/Box";
import { AbsTree, encode } from "./AbsTree";
import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import * as Tree from "./Tree";

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

    self.extWidth = () => {};
    self.extHeight = Tree.extHeight;
    self.layerHeight = Tree.layerHeight;
    self.nodeWidth = nodeWidth;
    self.nodeHeight = nodeHeight;
    self.link = Tree.link;
    self.root = Tree.root;
    self.newNode = newNode;
    self.newLink = newLink;
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

function newNode(parent, child, value = null) {
    let nodes = this.get("nodes");
    let group = this.layer("nodes");
    let node = { 
        parent: parent,
        id: child,
        node: this.nodeType()(group),
        is_first: true
    };
    node.node.value(value);
    let nwidth = this.nodeWidth();
    let nheight = this.nodeHeight();
    node.node.width(nwidth);
    node.node.height(nheight);
    nodes[child] = node;
    this.children.push(node.node);
}

function newLink(parent, child, value = null) {
    if (parent === "") return;
    let links = this.get("links");
    let group = this.layer("links");
    let idx = encode(parent, child);
    let link = { link: this.linkType()(group) };
    link.link.value(value);
    links[idx] = link;
    this.children.push(link.link);
}
