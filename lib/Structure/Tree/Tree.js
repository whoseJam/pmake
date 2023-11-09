import { Vertex } from "../Element/Vertex";
import { Link } from "../Link/Link";
import { Text } from "../Basic/Text";
import { trim } from "../../Utility/Trim";
import * as d3 from "d3";
import { Traiter } from "../../Utility/TypeTrait";
import { AbsTree, encode } from "./AbsTree";
import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";

export function Tree(node) {
    let self = {};
    
    self = Node(self, node, "Tree");
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

    self.extWidth = function() {};
    self.extHeight = extHeight;
    self.layerHeight = layerHeight;
    self.link = link;
    self.root = root;
    self.newNode = newNode;
    self.newLink = newLink;
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
    node.node.width(40);
    nodes[child] = node;
    this.children.push(node.node);
}

function newLink(parent, child, value = null) {
    if (parent === "") return;
    let links = this.get("links");
    let group = this.layer("links");
    let idx = encode(parent, child);
    let link = { 
        parent: parent,
        id: child,
        link: this.linkType()(group)
    };
    link.link.value(value);
    links[idx] = link;
    this.children.push(link.link);
}

export function link(parent, child) {
    let childId = null;
    let parentId = null;
    let childValue = null;
    let linkValue = null;
    let nodes = this.get("nodes");
    let links = this.get("links");
    if (arguments.length === 1) {
        let conf = arguments[0];
        parentId = conf.parent;
        childId = conf.id;
        linkValue = conf.linkValue;
        childValue = conf.value || childId;
    }
    if (Traiter.isSlide(parent)) {
        for (let i in nodes)
            if (nodes[i] === parent) parentId = i;
    } else if (Traiter.isText(child)) {
        parentId = parent;
    }
    if (Traiter.isSlide(child)) {
        for (let i in nodes)
            if (nodes[i] === child) childId = i;
    } else if (Traiter.isText(child)) {
        childId = childValue = child;
    }
    if (Traiter.isText(childValue))
        childValue = Text(this, childValue);
    if (Traiter.isText(linkValue))
        linkValue = Text(this, linkValue);
    
    if (nodes[childId] === undefined) this.newNode(parentId, childId, childValue);
    if (links[encode(parentId, childId)] === undefined)
        this.newLink(parentId, childId, linkValue);

    this.nodePreIn()(nodes[childId].node);
    this.linkPreIn()(links[encode(parentId, childId)].link);
    this.update();
    this.nodeIn()(nodes[childId].node);
    this.linkIn()(links[encode(parentId, childId)].link);

    this.update();
    return this;
}

export function root(root) {
    let rootId = null;
    let rootValue = null;
    let nodes = this.get("nodes");
    if (Traiter.isSlide(root)) {
        for (let i in nodes)
            if (nodes[i] === root) rootId = i;
    } else if (typeof(root) === "object") {
        let conf = arguments[0];
        rootId = conf.id;
        rootValue = conf.value;
    } else if (typeof(root) === "string" || typeof(root) === "number") { 
        rootId = rootValue = root;
    }
    if (Traiter.isText(rootValue))
        rootValue = Text(this, rootValue);
    this.newNode("", rootId, rootValue);

    this.nodePreIn()(nodes[rootId].node);
    this.update();
    this.nodeIn()(nodes[rootId].node);

    this.update();
    return this;
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
    let rt, nodes = this.get("nodes");
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