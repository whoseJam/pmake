import { Interact } from "../../Interact/Interact";
import { AbsTree, encode } from "./AbsTree";
import { Node } from "../../Node/Node";
import { Link } from "../Link/Link";
import * as Tree from "./Tree";
import { SDHelper } from "../../Utility/SDHelper";

export function ValueTree(node) {
    let self = {};
    
    self = Node(self, node, "ValueTree");
    self = AbsTree(self);
    self.newLayer("overlay");
    self.newLayer("links");
    self.newLayer("nodes");
    self = Interact(self);

    self.set("layerHeight", 50);
    self.set("links", {});
    self.set("nodes", {});
    self.set("linkType", Link);

    self.extWidth = SDHelper.emptyFunc;
    self.extHeight = extHeight;
    self.layerHeight = layerHeight;
    self.newNode = newNode;
    self.newLink = newLink;
    self.update = Tree.update;

    self.width(300);
    self.linkType(Link);

    return self;
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

function newNode(parent, child, value = null) {
    if (value === null) throw new Error("value is null");
    let nodes = this.get("nodes");
    let node = { 
        parent: parent,
        id: child,
        node: value
    };
    nodes[child] = node;
    value.attachTo(this.layer("nodes"));
    this.children.push(node.node);
}

function newLink(parent, child, value = null) {
    if (parent === "") return;
    let links = this.get("links");
    let group = this.layer("links");
    let idx = encode(parent, child);
    let link = { link: this._.linkType(group) };
    link.link.value(value);
    links[idx] = link;
    this.children.push(link.link);
}