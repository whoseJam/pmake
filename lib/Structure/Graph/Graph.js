import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { AbsGraph, encode } from "./AbsGraph";
import dagre from "dagre";
import { DagreHelper } from "../../Utility/DagreHelper";
import { trim } from "../../Utility/Trim";

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
    self._.rankDir = "TB";
    self._.align = undefined;
    self._.graph.setGraph({ rankdir: "TB" });
    self._.graph.setDefaultEdgeLabel(function() { return {}; });
    self.rankDir = rankDir;
    self.align = align;
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

function rankDir(rankDir) {
    if (rankDir === undefined) return this._.rankDir;
    this._.rankDir = rankDir;
    this._.graph.setGraph({ rankdir: rankDir });
    this.update();
    return this;
}

function align(align) {
    if (align === undefined) return this._.align;
    this._.align = align;
    this._.graph.setGraph({ align: align });
    this.update();
    return  this;
}

function update() {
    let graph = this._.graph;
    let nodes = this._.nodes;
    let links = this._.links;
    dagre.layout(graph);
    let box = DagreHelper.graphBox(graph);
    let self = this;
    function realX(x) {
        if (box.width === 0) return self._.x;
        let dx = x - box.x, tx = box.width;
        return self._.x + dx / tx * self._.width;
    }
    function realY(y) {
        if (box.height === 0) return self._.y;
        let dy = y - box.y, ty = box.height;
        return self._.y + dy / ty * self._.height;
    }
    graph.nodes().forEach(function(info) {
        let handle = nodes[info].node;
        let layout = graph.node(info);
        handle.parent = null;
        if (nodes[info].isFirst) {
            self.nodePreIn()(handle);
            self.nodeIn()(handle);
            nodes[info].isFirst = false;
        }
        handle.cx(realX(layout.x));
        handle.cy(realY(layout.y));
        handle.parent = this;
    });
    graph.edges().forEach(function(info) {
        let x = info.v;
        let y = info.w;
        let handle = links[encode(x, y)].link;
        handle.parent = null;
        let nx = nodes[x].node;
        let ny = nodes[y].node;
        if (links[encode(x, y)].isFirst) {
            self.linkPreIn()(handle);
            handle.source(nx.cx(), nx.cy());
            handle.target(ny.cx(), ny.cy());
            trim(handle, nx, ny);
            self.linkIn()(handle);
            links[encode(x, y)].isFirst = false;
        } else {
            handle.source(nx.cx(), nx.cy());
            handle.target(ny.cx(), ny.cy());
            trim(handle, nx, ny);
        }
        handle.parent = this;
    });
    this.isDirty = false;
    this.children.update();
}