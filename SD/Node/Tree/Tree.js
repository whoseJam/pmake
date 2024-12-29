import { Vector as V } from "@/Math/Vector";
import { Vertex } from "@/Node/Element/Vertex";
import { Line } from "@/Node/Nake/Line";
import { Enter as EN } from "@/Node/SDNode/Enter";
import { effect } from "@/Node/SDNode/SDValue";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { Cast } from "@/Utility/Cast";
import { Factory } from "@/Utility/Factory";
import { trim } from "@/Utility/Trim";
import { hierarchy, stratify, tree } from "d3";

export function Tree(parent) {
    BaseTree.call(this, parent);

    this.type("Tree");
    this.newLayer("links");
    this.newLayer("nodes");

    this._.nodeType = Vertex;
    this._.linkType = Line;
    this._.lateUpdate = [];

    this.vars.merge({
        r: 20,
        width: 300,
        height: 0,
        layerHeight: 60
    });

    this._.updater = effect(() => {
        const r = this.vars.r;
        _D3Layout.apply(this, [
            "vertical",
            node => [node.x + this.x(), node.y + this.y()],
            (node, limit) => node.r(Math.min(r, limit / 2.1))
        ]);
    });
}

Tree.prototype = {
    ...BaseTree.prototype
};

Tree.prototype.width = Factory.handlerLowPrecise("width");
Tree.prototype.r = Factory.handlerLowPrecise("r");
Tree.prototype.layerHeight = Factory.handlerLowPrecise("layerHeight");
Tree.prototype.height = function (height) {
    if (height === undefined) return this.vars.height;
    const depth = this.depth();
    if (!depth) return this;
    this.layerHeight(height / depth);
    return this;
}

Tree.prototype.newNode = function (id, value) {
    const element = new this._.nodeType(this.layer("nodes"));
    element.value(Cast.castToSDNode(element, value, id));
    element.onEnter(EN.appear("nodes"));
    this.newNodeByBaseTree(id, element);
    this._.lateUpdate.forEach(update => update());
    this._.lateUpdate = [];
    return this;
}

Tree.prototype.newNodeFromExistValue = function (id, value) {
    const element = new this._.nodeType(this.layer("nodes"));
    element.onEnter(EN.appear("nodes"));
    this.newNodeByBaseTree(id, element);
    element.value(value.onEnter(EN.moveTo()));
    this._.lateUpdate.forEach(update => update());
    this._.lateUpdate = [];
    return this;
}

Tree.prototype.newNodeFromExistElement = function (id, value) {
    const element = value;
    element.onEnter(EN.moveTo("nodes"));
    this.newNodeByBaseTree(id, element);
    this._.lateUpdate.forEach(update => update());
    this._.lateUpdate = [];
    return this;
}

Tree.prototype.newLink = function (x, y, value = null) {
    const element = new this._.linkType(this.layer("links"));
    if (value !== null) element.value(value);
    element.onEnter(EN.appear("links"));
    this.newLinkByBaseTree(x, y, element);
    console.log("late update length=", this._.lateUpdate);
    this._.lateUpdate.forEach(update => update());
    this._.lateUpdate = [];
    return this;
}

Tree.prototype.newLinkFromExistValue = function (sourceId, targetId, value) {
    const element = new this._.linkType(this.layer("links"));
    element.onEnter(EN.appear("links"));
    this.newLinkByBaseTree(sourceId, targetId, element);
    element.value(value.onEnter(EN.moveTo()));
    this._.lateUpdate.forEach(update => update());
    this._.lateUpdate = [];
    return this;
}

Tree.prototype.newLinkFromExistElement = function (sourceId, targetId, value) {
    const element = value;
    element.onEnter(EN.moveTo("links"));
    this.newLinkByBaseTree(sourceId, targetId, element);
    this._.lateUpdate.forEach(update => update());
    this._.lateUpdate = [];
    return this;
}

export function _D3Layout(mode, convert, size) {
    let data, root, layout, result;
    try {
        const template = stratify();
        template.id(d => this.nodeId(d));
        template.parentId(d => {
            const father = this.father(d);
            return father ? this.nodeId(father) : undefined;
        });
        data = template(this.vars.nodes);
    } catch (e) { return; }
    root = hierarchy(data);
    this.vars[mode === "vertical" ? "height" : "width"] = root.height * this[mode === "vertical" ? "layerHeight" : "layerWidth"]();
    layout = tree().size([
        this.vars[mode === "vertical" ? "width" : "height"],
        this.vars[mode === "vertical" ? "height" : "width"]
    ]);
    result = layout(root);

    // auto adjust the node size
    // limit: the min distance between any two node
    let limit = Infinity;
    const nodes = result.descendants();
    const links = result.links();
    nodes.forEach((nodeI, i) => {
        const vecI = convert(nodeI);
        for (let j = i + 1; j < nodes.length; j++) {
            const nodeJ = nodes[j];
            const vecJ = convert(nodeJ);
            limit = Math.min(limit, V.length(V.sub(vecI, vecJ)));
        }
    })

    // update the position of nodes
    nodes.forEach(nodeInfo => {
        const node = nodeInfo.data.data;
        const update = () => {
            size(node, limit);
            node.center(convert(nodeInfo));
        };
        console.log("node on enter=", node.onEnter());
        if (node.onEnter()) this._.lateUpdate.push(() => node.triggerEnter(this, update));
        else update();
    });
    links.forEach(linkInfo => {
        const source = linkInfo.source;
        const target = linkInfo.target;
        const src = source.data.id;
        const tgt = target.data.id;
        const link = this.findLinkById(src, tgt);
        if (!link) return;
        const update = () => {
            link.source(convert(source));
            link.target(convert(target));
            trim(link, this.findNodeById(src), this.findNodeById(tgt));
        };
        if (link.onEnter()) this._.lateUpdate.push(() => link.triggerEnter(this, update));
        else update();
    });
    return true;
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
        data = template(this.vars.nodes);
    } catch (e) {
        return false;
    }
    root = hierarchy(data);
    this.vars[mode === "vertical" ? "height" : "width"] = root.height * this[mode === "vertical" ? "layerHeight" : "layerWidth"]();
    layout = tree().size([
        this.vars[mode === "vertical" ? "width" : "height"],
        this.vars[mode === "vertical" ? "height" : "width"]
    ]);
    result = layout(root);

    // auto adjust the node size
    // limit: the min distance between any two node
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
        setSize(node, limit);
        node.center(x, y);
    });
    links.forEach(linkInfo => {
        const source = linkInfo.source;
        const target = linkInfo.target;
        const src = source.data.id;
        const tgt = target.data.id;
        const link = this.findLinkById(src, tgt);
        if (!link) return;
        link.source(transX(source), transY(source));
        link.target(transX(target), transY(target));
        trim(link, this.findNodeById(src), this.findNodeById(tgt));
    });
    return true;
}