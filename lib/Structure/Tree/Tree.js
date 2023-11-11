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

    self.set("layerHeight", 50);
    self.set("nodeType", Vertex);
    self.set("linkType", Link);

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

export function extHeight(height) {
    let hierarchy = getHierarchy.call(this), div;
    if (!hierarchy || hierarchy.height === 0) div = 1;
    else div = hierarchy.height;
    this.set("layerHeight", height / div);
}

export function layerHeight(height) {
    if (height === undefined)
        return this.get("layerHeight");
    this.set("layerHeight", height);
    let hierarchy = getHierarchy.call(this);
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
    node.node.width(40);
}

export function update() {
    let hierarchy = getHierarchy.call(this);
    if (hierarchy) {
        let height = hierarchy.height * this.layerHeight();
        this.set("height", height); this.call("onHeight");
    }

    let info = getInfo.call(this);
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

function getHierarchy() {
    let rt, nodes = this._.nodes;
    let flattenNodes = [];
    for (let i in nodes)
        flattenNodes.push(nodes[i]);
    try {
        rt = d3.stratify()
            .id(d => d["id"])
            .parentId(d => d["parent"])
            (flattenNodes);
    } catch(error) { 
        // console.log(flattenNodes);
        // console.log(error);
        return null; }
    return d3.hierarchy(rt);
}

function getInfo() {
    let hierarchy = getHierarchy.call(this);
    if (!hierarchy) return null;
    let width = this.width();
    let height = this.layerHeight();
    let tr = d3.tree().size([width, hierarchy.height * height]);
    return tr(hierarchy);
}