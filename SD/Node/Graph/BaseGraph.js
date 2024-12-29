import { Vertex } from "@/Node/Element/Vertex";
import { Line } from "@/Node/Nake/Line";
import { SDNode } from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { Factory } from "@/Utility/Factory";

export function BaseGraph(parent) {
    SDNode.call(this, parent);

    this.newLayer("nodes");
    this.newLayer("links");

    this.vars.merge({
        x: 0,
        y: 0,
        width: 300,
        height: 300,
        links: [],
        nodes: []
    });

    this._.sidToLinks = {};  // id of SDNode -> { link: link, source: id on Graph, target: id on Graph }
    this._.sidToNodes = {};  // id of SDNode -> { node: node, key: id on Graph }
    this._.gidToNodes = {};  // id on Graph -> { node: node, key: id of SDNode }
    this._.nodeType = Vertex;
    this._.linkType = Line;

    this._.BASE_GRAPH = true;
}

BaseGraph.prototype = {
    ...SDNode.prototype
};

BaseGraph.prototype.x = Factory.handlerLowPrecise("x");
BaseGraph.prototype.y = Factory.handlerLowPrecise("y");
BaseGraph.prototype.width = Factory.handlerLowPrecise("width");
BaseGraph.prototype.height = Factory.handlerLowPrecise("height");

BaseGraph.prototype.color = BaseTree.prototype.color;
BaseGraph.prototype.value = BaseTree.prototype.value;
BaseGraph.prototype.element = BaseTree.prototype.element;
BaseGraph.prototype.opacity = BaseTree.prototype.opacity;

BaseGraph.prototype.text = function () {
    return this.value.apply(this, arguments).text();
}

BaseGraph.prototype.findNodeById = function (id) {
    const graphId = String(id);
    const gidToNodes = this._.gidToNodes;
    const node = gidToNodes[graphId];
    return node?.node;
}

BaseGraph.prototype.findLinkById = function (sourceId, targetId) {
    const sourceGraphId = String(sourceId);
    const targetGraphId = String(targetId);
    const links = this.vars.links;
    const sidToLinks = this._.sidToLinks;
    for (let i = 0; i < links.length; i++) {
        if (sidToLinks[links[i].id].source === sourceGraphId &&
            sidToLinks[links[i].id].target === targetGraphId) {
            return sidToLinks[links[i].id].link;
        }
    }
    return undefined;
}

BaseGraph.prototype.inLinks = function (id, mode = "direct") {
    const graphId = String(id);
    const links = this.vars.links;
    const sidToLinks = this._.sidToLinks;
    const filter = (mode === "direct") ?
        link => sidToLinks[link.id].target === graphId :
        link => sidToLinks[link.id].target === graphId || sidToLinks[link.id].source === graphId;
    return links.filter(filter);
}

BaseGraph.prototype.outLinks = function (id, mode = "direct") {
    const graphId = String(id);
    const links = this.vars.links;
    const sidToLinks = this._.sidToLinks;
    const filter = (mode === "direct") ?
        link => sidToLinks[link.id].source === graphId :
        link => sidToLinks[link.id].target === graphId || sidToLinks[link.id].source === graphId;
    return links.filter(filter);
}

BaseGraph.prototype.inNodes = function (id, mode = "direct") {
    const graphId = String(id);
    return [...new Set(this.inLinks(graphId, mode).map(link => this.toNode(link, graphId)))];
}

BaseGraph.prototype.outNodes = function (id, mode = "direct") {
    const graphId = String(id);
    return [...new Set(this.outLinks(graphId, mode).map(link => this.toNode(link, graphId)))];
}

BaseGraph.prototype.inNodesId = function (id, mode = "direct") {
    return this.inNodes(id, mode).map(node => this.nodeId(node));
}

BaseGraph.prototype.outNodesId = function (id, mode = "direct") {
    return this.outNodes(id, mode).map(node => this.nodeId(node));
}

BaseGraph.prototype.newNodeByBaseGraph = function (id, element) {
    const graphId = String(id);
    const sidToNodes = this._.sidToNodes;
    const gidToNodes = this._.gidToNodes;
    sidToNodes[element.id] = { node: element, key: graphId };
    gidToNodes[graphId] = { node: element, key: element.id };
    element.triggerEnter(this, () => {
        this.childAs(element);
        this.vars.nodes.push(element);
    });
    return this;
}

BaseGraph.prototype.newLinkByBaseGraph = function (sourceId, targetId, element) {
    const sourceGraphId = String(sourceId);
    const targetGraphId = String(targetId);
    const sidToLinks = this._.sidToLinks;
    sidToLinks[element.id] = { link: element, source: sourceGraphId, target: targetGraphId };
    element.triggerEnter(this, () => {
        this.childAs(element);
        this.vars.links.push(element);
    });
    return this;
}

BaseGraph.prototype.link = function (x, y, value = null) {
    if (!this.findNodeById(y)) this.newNode(y);
    if (!this.findNodeById(x)) this.newNode(x);
    this.newLink(x, y, value);
    return this;
}

BaseGraph.prototype.cut = function (x, y) {
    const links = this.vars.links;
    let link = this.findLinkById(x, y);
    let idx = links.indexOf(link);
    links.splice(idx, 1);
    this.eraseChild(link);
    return this;
}

BaseGraph.prototype.nodes = function () {
    return [...this.vars.nodes];
}

BaseGraph.prototype.nodeId = function (node) {
    const sidToNodes = this._.sidToNodes;
    return sidToNodes[node.id].key;
}

BaseGraph.prototype.links = function () {
    return [...this.vars.links];
}

BaseGraph.prototype.sourceId = function (link) {
    const sidToLinks = this._.sidToLinks;
    return sidToLinks[link.id].source;
}

BaseGraph.prototype.targetId = function (link) {
    const sidToLinks = this._.sidToLinks;
    return sidToLinks[link.id].target;
}

BaseGraph.prototype.nodesId = function () {
    const nodesId = this.vars.nodes.map(node => node.nodeId);
    return [...new Set(nodesId)];
}

BaseGraph.prototype.toNode = function (link, sourceId) {
    const sourceGraphId = String(sourceId);
    const sidToLinks = this._.sidToLinks;
    const gidToNodes = this._.gidToNodes;
    link = sidToLinks[link.id];
    return gidToNodes[(link.source === sourceGraphId) ? link.target : link.source].node;
}

BaseGraph.prototype.toNodeId = function (link, sourceId) {
    return this.nodeId(this.toNode(link, sourceId))
}

BaseGraph.prototype.forEachNodes = function (callback) {
    this.nodes().forEach(node => callback(node, this.nodeId(node)));
    return this;
}

BaseGraph.prototype.forEachLinks = function (callback) {
    this.links().forEach(link => callback(link, this.sourceId(link), this.targetId(link)));
    return this;
}