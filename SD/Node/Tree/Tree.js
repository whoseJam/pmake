import { Line }     from "@/Node/Nake/Line";
import { Enter }    from "@/Node/SDNode/Enter";
import { SDNode }   from "@/Node/SDNode";
import { Vertex }   from "@/Node/Element/Vertex";
import { BaseTree } from "@/Node/Tree/BaseTree";

import { Vector } from "@/Math/Vector";

import { trim } from "@/Utility/Trim";
import { Cast } from "@/Utility/Cast";

import { tree }      from "d3";
import { stratify }  from "d3";
import { hierarchy } from "d3";

export function Tree(parent) {
    BaseTree.call(this, parent);

    this.type("Tree");
    this.newLayer("links");
    this.newLayer("nodes");

    this._.nodeType = Vertex;
    this._.linkType = Line;

    this.member.new("r", 20);
    this.member.new("width", 300);
    this.member.new("height", 0);
    this.member.new("layerHeight", 60);
}

Tree.prototype = {
    ...BaseTree.prototype
};

Tree.prototype.width       = SDNode.OrdinaryGSet("width", "setByEqual");
Tree.prototype.r           = SDNode.OrdinaryGSet("r", "setByEqual");
Tree.prototype.layerHeight = SDNode.OrdinaryGSet("layerHeight", "setByEqual");
Tree.prototype.height = function(height) {
    if (height === undefined) {
        return this.member.get("height");
    }
    const depth = this.depth();
    if (!depth) return this;
    this.layerHeight(height / depth);
    return this;
}

Tree.prototype.updateList = [
    ...Tree.prototype.updateList,
    update
];

Tree.prototype.newNode = function(id, value) {
    const element = new this._.nodeType(this.layer("nodes"));
    element.value(Cast.castToSDNode(element, value, id));
    element.onEnter(Enter.ordinary(this, "nodes"));
    this.newNodeByBaseTree(id, element);
    return this;
}

Tree.prototype.newNodeFromExistValue = function(tid, value) {
    const element = new this._.nodeType(this.layer("nodes"));
    element.onEnter(Enter.fromExistValue(this, value, "nodes"));
    this.newNodeByBaseTree(tid, element);
    return this;
}

Tree.prototype.newNodeFromExistElement = function(tid, value) {
    const element = value;
    element.onEnter(Enter.fromExist(this, "nodes"));
    this.newNodeByBaseTree(tid, element);
    return this;
}

Tree.prototype.newLink = function(x, y, value = null) {
    const element = new this._.linkType(this.layer("links"));
    if (value !== null) element.value(value);
    element.onEnter(Enter.ordinary(this, "links"));
    this.newLinkByBaseTree(x, y, element);
    return this;
}

Tree.prototype.newLinkFromExistValue = function(sourceTid, targetTid, value) {
    const element = new this._.linkType(this.layer("links"));
    element.onEnter(Enter.fromExistValue(this, value, "links"));
    this.newLinkByBaseTree(sourceTid, targetTid, element);
    return this;
}

Tree.prototype.newLinkFromExistElement = function(sourceTid, targetTid, value) {
    const element = value;
    element.onEnter(Enter.fromExist(this, "links"));
    this.newLinkByBaseTree(sourceTid, targetTid, element);
    return this;
}

function update() {
    if (this.member.hasChanged("nodes") ||
        this.member.hasChanged("links") ||
        this.member.hasChanged("r") ||
        this.member.hasChanged("width") ||
        this.member.hasChanged("layerHeight")) {
        const r = this.member.get("r");
        D3Layout.apply(this, [
            "vertical",
            node => node.x + this.x(),
            node => node.y + this.y(),
            (node, limit) => node.r(Math.min(r, limit / 2.1))
        ]);
        this.member.flush("nodes");
        this.member.flush("links");
        this.member.flush("r");
        this.member.flush("width");
        this.member.flush("layerHeight");
    }
}

export function D3Layout(mode, transX, transY, setSize) {
    // call d3 to make
    // data: the dataset of the tree
    // root: the root of the tree, which hold the hierarchy of the tree
    // layout: analyse the position of each node
    // result: the result
    let data, root, layout, result;
    try {
        const template = stratify();
        template.id(d => this.nodeId(d));
        template.parentId(d => {
            const father = this.father(d);
            return father ? this.nodeId(father) : undefined;
        });
        data = template(this.member.get("nodes"));
    } catch(error) { return this; }
    root = hierarchy(data);
    this.member.setAndFlush(mode === "vertical" ? "height" : "width", root.height * this[mode === "vertical" ? "layerHeight": "layerWidth"]());
    layout = tree().size([
        this.member.get(mode === "vertical" ? "width" : "height"),
        this.member.get(mode === "vertical" ? "height" : "width")
    ]);
    result = layout(root);

    // auto adjust the node size
    // limit: the min distance between any two node
    const V = Vector.getIns();
    let limit = Infinity;
    const nodes = result.descendants();
    const links = result.links();
    nodes.forEach((nodeI, i) => {
        const vecI = [transX(nodeI), transY(nodeI)];
        for (let j = i + 1; j < nodes.length; j++) {
            const nodeJ = nodes[j];
            const vecJ = [transX(nodeJ), transY(nodeJ)];
            limit = Math.min(limit, V.length(V.sub(vecI, vecJ)));
        }
    })

    // update the position of nodes
    nodes.forEach(nodeInfo => {
        const x = transX(nodeInfo);
        const y = transY(nodeInfo);
        const node = nodeInfo.data.data;
        this.tryMove(node, () => {
            setSize(node, limit);
            node.cx(x).cy(y);
        });
    });
    links.forEach(linkInfo => {
        const source = linkInfo.source;
        const target = linkInfo.target;
        const src = source.data.id;
        const tgt = target.data.id;
        const link = this.findLinkById(src, tgt);
        if (!link) return;
        this.tryMove(link, () => {
            link.source(transX(source), transY(source));
            link.target(transX(target), transY(target));
            trim(link, this.findNodeById(src), this.findNodeById(tgt));
        });
    });
}