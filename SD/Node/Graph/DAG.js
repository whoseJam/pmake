import { mapTo } from "@/Math/Math";
import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { Enter as EN } from "@/Node/SDNode/Enter";
import { effect } from "@/Node/SDNode/SDValue";
import { Cast } from "@/Utility/Cast";
import { Factory } from "@/Utility/Factory";
import { trim } from "@/Utility/Trim";
import { layout as DAGLayout, graphlib as DAGLib } from "dagre";

export function DAG(parent) {
    BaseGraph.call(this, parent);

    this.type("DAG");

    this.vars.merge({
        rankDir: "TB",
        align: undefined
    });
    
    const graph = new DAGLib.Graph();
    graph.setGraph({ rankdir: "TB" });
    graph.setDefaultEdgeLabel(function() { return {}; });
    this._.graph = graph;

    this._.updater = effect(() => {
        graph.setGraph({
            align: this.align(),
            rankdir: this.rankDir()
        });
        DAGLayout(graph);
        const box = GetBoxOfDAG(graph);
        const mapperX = mapTo(box.x, box.width, this.x(), this.width());
        const mapperY = mapTo(box.y, box.height, this.y(), this.height());
        const convertX = node => mapperX(node.x);
        const convertY = node => mapperY(node.y);
        const convert = node => [convertX(node), convertY(node)];
        this.forEachNodes((node, nodeId) => {
            const layout = graph.node(nodeId);
            node.center(convert(layout));
        });
        this.forEachLinks((link, sourceId, targetId) => {
            const source = this.findNodeById(sourceId);
            const target = this.findNodeById(targetId);
            link.source(source.center());
            link.target(target.center());
            trim(link, source, target);
        });
    });
}

DAG.prototype = {
    ...BaseGraph.prototype
};

DAG.prototype.align = Factory.handler("align");
DAG.prototype.rankDir = Factory.handler("rankDir");

DAG.prototype.newNode = function(id, value) {
    const element = new this._.nodeType(this.layer("nodes"));
    element.value(Cast.castToSDNode(element, value, id));
    element.onEnterDefault(EN.appear("nodes"));
    this._.graph.setNode(id, {});
    this.newNodeByBaseGraph(id, element);
    return this;
}

DAG.prototype.newLink = function(sourceId, targetId, value) {
    const element = new this._.linkType(this.layer("links"));
    element.value(value);
    element.onEnterDefault(EN.appear("links"));
    this._.graph.setEdge(sourceId, targetId);
    this.newLinkByBaseGraph(sourceId, targetId, element);
    return this;
}

export function GetBoxOfDAG(graph) {
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
    if (x === undefined) x = mx = y = my = 0;
    return { x, y, width: mx - x, height: my - y };
}