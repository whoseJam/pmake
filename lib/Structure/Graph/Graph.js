import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { Link } from "../Link/Link";
import { Vertex } from "../Element/Vertex";
import { AbsGraph, encode } from "./AbsGraph";
import { Text } from "../Basic/Text";
import dagre from "dagre";
import { DagreHelper } from "../../Utility/DagreHelper";

export function Graph(node) {
    let self = {};

    self = Node(self, node);
    self = AbsGraph(self);
    self.newLayer("overlay");
    self.newLayer("links");
    self.newLayer("nodes");
    self = Interact(self, self.layer("overlay"));

    self._.r = 20;
    self._.graph = new dagre.graphlib.Graph();
    self._.graph.setGraph({});
    self._.graph.setDefaultEdgeLabel(function() { return {}; });

    self.extWidth = function() {};
    self.extHeight = function() {};
    self.extNewNode = extNewNode;
    self.extNewLink = extNewLink;
    self.update = update;

    self.width(300);
    self.height(300);

    return self;
}

function extNewNode(node) {
    let id = node.id;
    let handle = node.node;
    let graph = this._.graph;
    graph.setNode(id, {
        label: id,
        width: this._.r * 2,
        height: this._.r * 2
    });
    handle.width(this._.r * 2);
    handle.height(this._.r * 2);
}

function extNewLink(link) {
    let x = link.source;
    let y = link.target;
    let graph = this._.graph;
    graph.setEdge(x, y);
}

function update() {
    let graph = this._.graph;
    let nodes = this._.nodes;
    let links = this._.links;
    dagre.layout(graph);
    let box = DagreHelper.graphBox(graph);
    let thisX = this._.x;
    let thisY = this._.y;
    let thisWidth = this._.width;
    let thisHeight = this._.height;
    function realX(x) {
        if (box.width === 0) return x;
        let dx = x - box.x, tx = box.width;
        return thisX + dx / tx * thisWidth;
    }
    function realY(y) {
        if (box.height === 0) return y;
        let dy = y - box.y, ty = box.height;
        return thisY + dy / ty * thisHeight;
    }
    graph.nodes().forEach(function(info) {
        let handle = nodes[info].node;
        let layout = graph.node(info);
        handle.parent = null;
        handle.cx(realX(layout.x));
        handle.cy(realY(layout.y));
        handle.parent = this;
    });
    graph.nodes().forEach(function(info) {
        let handle = nodes[info].node;
        let layout = graph.node(info);
        handle.parent = null;
        handle.cx(realX(layout.x));
        handle.cy(realY(layout.y));
        handle.parent = this;
    });
    graph.edges().forEach(function(info) {
        let x = info.v;
        let y = info.w;
        let handle = links[encode(x, y)][0].link;
        handle.parent = null;
        let nx = nodes[x].node;
        let ny = nodes[y].node;
        handle.from(nx).to(ny);
        handle.parent = this;
    });
    this.isDirty = false;
    this.children.update();
}