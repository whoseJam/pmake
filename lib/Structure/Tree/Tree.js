import { Vertex } from "../Element/Vertex";
import { Link } from "../Link/Link";
import { Text } from "../Basic/Text";
import { trim } from "../../Utility/Trim";
import * as d3 from "d3";
import { Traiter } from "../../Utility/TypeTrait";
import { AbsTree, encode } from "./AbsTree";
import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import { SDHelper } from "../../Utility/SDHelper";

export function Tree(node) {
    let self = {};
    self = Node(self, node, "Tree");
    self = AbsTree(self);
    self.newLayer("overlay");
    self.newLayer("links");
    self.newLayer("nodes");
    self = Interact(self, self.layer("overlay"));
    self._.layerHeight = 60;
    self._.nodeType = Vertex;
    self._.linkType = Link;
    self.extWidth = SDHelper.emptyFunc;
    self.extHeight = extHeight;
    self.extNewNode = extNewNode;
    self.extNewLink = SDHelper.emptyFunc;
    self.layerHeight = layerHeight;
    self.r = r;
    self.update = update;

    self.width(300);
    self.nodeType(Vertex);
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

export function update() {
    let hierarchy = SDHelper.treeHierarchy.call(this);
    if (hierarchy) {
        let height = hierarchy.height * this.layerHeight();
        this.set("height", height); this.call("onHeight");
    }

    let info = SDHelper.treeInfo.call(this);
    if (!info) return;
    let nodes = this.get("nodes");
    let links = this.get("links");
    info.descendants().forEach((node) => {
        let x = node.x + this.x();
        let y = node.y + this.y();
        let data = node.data.data;
        node = data.node;
        node.parent = null;
        node.cx(x).cy(y);
        node.parent = this;
    });
    info.links().forEach((link) => {
        let source = link.source;
        let target = link.target;
        let src = source.data.id;
        let tgt = target.data.id;
        if (!links[encode(src, tgt)]) return;
        link = links[encode(src, tgt)].link;
        link.parent = null;
        link.source(source.x + this.x(), source.y + this.y());
        link.target(target.x + this.x(), target.y + this.y());
        trim(link, nodes[src].node, nodes[tgt].node);
        link.parent = this;
    });
    this.isDirty = false;
    this.children.update();
}