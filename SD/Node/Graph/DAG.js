import { dagreGraphToBox, evaluateValue } from "../../Utility/Tool";
import { BaseGraph } from "./BaseGraph";
import { SDNode } from "../SDNode";
import { Vertex } from "../Element/Vertex";
import { Line } from "../Nake/Line";
import { trim } from "../../SD";
import * as dagre from "dagre";

export function DAG(parent) {
    BaseGraph.call(this, parent);

    this.g().type("DAG");
    this.member.new("r", 20);
    this.member.new("graph", new dagre.graphlib.Graph());
    this.member.new("rankDir", "TB");
    this.member.new("align", undefined);
    
    const graph = this.member.get("graph");
    graph.setGraph({ rankdir: "TB" });
    graph.setDefaultEdgeLabel(function() { return {}; });
}

DAG.prototype = {
    ...BaseGraph.prototype
};

DAG.prototype.align   = dagreGetterAndSetter("align", "align");
DAG.prototype.rankDir = dagreGetterAndSetter("rankDir", "rankdir");

DAG.prototype.updateList = [
    ...DAG.prototype.updateList,
    update
];

DAG.prototype.newNode = function(id, value) {
    const element = new this._.nodeType(this.layer("nodes"));
    element.value(evaluateValue(id, value));
    element._.enter = (element, move) => {
        element.opacity(0);
        move();
        element.unfreeze().freeze();
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
        element.unfreeze().freeze();
        element.startAnimate(this).opacity(1);
    };
    const graph = this.member.get("graph");
    graph.setEdge(x, y);
    this.newLinkByBaseGraph(x, y, element);
    return this;
}

function dagreGetterAndSetter(key, keyInDagre) {
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
    dagre.layout(graph);
    const box = dagreGraphToBox(graph);
    const convertX = node => {
        const x = this.member.get("x");
        if (box.width === 0) {
            return x;
        }
        const width = this.member.get("width");
        return x + (node.x - box.x) / box.width * width;
    }
    const convertY = node => {
        const y = this.member.get("y");
        if (box.height === 0) {
            return y;
        }
        const height = this.member.get("height");
        return y + (node.y - box.y) / box.height * height;
    }
    graph.nodes().forEach(nodeId => {
        const node = this.findNodeById(nodeId);
        const layout = graph.node(nodeId);
        this.tryMove(node, () => {
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