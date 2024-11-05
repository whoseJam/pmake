import { trim } from "@/Utility/Trim";
import { Cast } from "@/Utility/Cast";

import { mapTo } from "@/Math/Math";

import { Enter }     from "@/Node/SDNode/Enter";
import { BaseGraph } from "@/Node/Graph/BaseGraph";

import { graphlib as DAGLib }  from "dagre";
import { layout as DAGLayout } from "dagre";

export function DAG(parent) {
    BaseGraph.call(this, parent);

    this.type("DAG");
    this.member.new("r", 20);
    this.member.new("graph", new DAGLib.Graph());
    this.member.new("rankDir", "TB");
    this.member.new("align", undefined);

    this.member.new("updateNodeSize", (element) => {
        if ("r" in element) {
            const r = this.member.get("r");
            element.r(r);
        }
    })
    
    const graph = this.member.get("graph");
    graph.setGraph({ rankdir: "TB" });
    graph.setDefaultEdgeLabel(function() { return {}; });
}

DAG.prototype = {
    ...BaseGraph.prototype
};

DAG.prototype.align   = DAGGSet("align", "align");
DAG.prototype.rankDir = DAGGSet("rankDir", "rankdir");

DAG.prototype.updateList = [
    ...DAG.prototype.updateList,
    update
];

DAG.prototype.newNode = function(id, value) {
    const element = new this._.nodeType(this.layer("nodes"));
    element.value(Cast.castToSDNode(element, value, id));
    element.onEnter(Enter.ordinary(this));
    const graph = this.member.get("graph");
    graph.setNode(id, {});
    this.newNodeByBaseGraph(id, element);
    return this;
}

DAG.prototype.newLink = function(sourceId, targetId, value) {
    const element = new this._.linkType(this.layer("links"));
    element.value(value);
    element.onEnter(Enter.ordinary(this));
    const graph = this.member.get("graph");
    graph.setEdge(sourceId, targetId);
    this.newLinkByBaseGraph(sourceId, targetId, element);
    return this;
}

function DAGGSet(key, keyInDagre) {
    return function(value) {
        if (value === undefined) {
            return this.member.get(key);
        }
        this.member.setAndFlush(key, value);
        const graph = this.member.get("graph");
        const dict = {};
        dict[keyInDagre] = value;
        graph.setGraph(dict);
        this.tryUpdate();
        return this;
    }
}

function update() {
    const graph = this.member.get("graph");
    DAGLayout(graph);
    const box = GetBoxOfDAG(graph);

    const convertXInner = mapTo(
        box.x,
        box.width,
        this.member.get("x"),
        this.member.get("width")
    );
    const convertYInner = mapTo(
        box.y,
        box.height,
        this.member.get("y"),
        this.member.get("height")
    );
    const convertX = node => convertXInner(node.x);
    const convertY = node => convertYInner(node.y);
    const updateSize = this.member.get("updateNodeSize");
    graph.nodes().forEach(nodeId => {
        const node = this.findNodeById(nodeId);
        const layout = graph.node(nodeId);
        this.tryMove(node, () => {
            updateSize(node);
            node.cx(convertX(layout));
            node.cy(convertY(layout));
        });
    });
    graph.edges().forEach(linkInfo => {
        const sourceId = linkInfo.v;
        const targetId = linkInfo.w;
        const link = this.findLinkById(sourceId, targetId);
        const source = this.findNodeById(sourceId);
        const target = this.findNodeById(targetId);
        this.tryMove(link, () => {
            link.source(source.center());
            link.target(target.center());
            trim(link, source, target);
        });
    });
}

function GetBoxOfDAG(graph) {
    let x, mx, y, my;
    graph.nodes().forEach(function(info) {
        const layout = graph.node(info);
        if (x === undefined) {
            x = mx = layout.x;
            y = my = layout.y;
        } else {
            x = Math.min(x, layout.x);
            mx = Math.max(mx, layout.x);
            y = Math.min(y, layout.y);
            my = Math.max(my, layout.y);
        }
    })
    if (x === undefined)
        x = mx = y = my = 0;
    return {
        x: x,
        y: y,
        width: mx - x,
        height: my - y
    };
}