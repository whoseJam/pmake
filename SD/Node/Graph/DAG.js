import { trim }             from "@/Utility/Trim";
import { mapTo }            from "@/Utility/Math";
import { SelectValidValue } from "@/Utility/Cast";

import { BaseGraph } from "@/Node/Graph/BaseGraph";

import { graphlib as DAGLib }  from "dagre";
import { layout as DAGLayout } from "dagre";

export function DAG(parent) {
    BaseGraph.call(this, parent);

    this.g().type("DAG");
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

DAG.prototype.align   = DAGGetterAndSetter("align", "align");
DAG.prototype.rankDir = DAGGetterAndSetter("rankDir", "rankdir");

DAG.prototype.updateList = [
    ...DAG.prototype.updateList,
    update
];

DAG.prototype.newNode = function(id, value) {
    const element = new this._.nodeType(this.layer("nodes"));
    element.value(SelectValidValue(value, id));
    element._.enter = (element, move) => {
        element.opacity(0);
        move();
        element.update();
        element.startAnimate(this).opacity(1);
    };
    const graph = this.member.get("graph");
    graph.setNode(id, {
        label: id,
        width: this.member.get("r") * 2,
        height: this.member.get("r") * 2
    });
    this.newNodeByBaseGraph(id, element);
    return this;
}

DAG.prototype.newLink = function(x, y, value) {
    const element = new this._.linkType(this.layer("links"));
    element.value(value);
    element._.enter = (element, move) => {
        element.opacity(0);
        move();
        element.update();
        element.startAnimate(this).opacity(1);
    };
    const graph = this.member.get("graph");
    graph.setEdge(x, y);
    this.newLinkByBaseGraph(x, y, element);
    return this;
}

function DAGGetterAndSetter(key, keyInDagre) {
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