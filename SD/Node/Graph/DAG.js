import { dagreGraphToBox, evaluateValue } from "../../Utility/Tool";
import { BaseGraph } from "./BaseGraph";
import { trim } from "../../SD";
import { mapTo } from "@/Utility/Math";
import * as dagre from "dagre";

export function DAG(parent) {
    BaseGraph.call(this, parent);

    this.g().type("DAG");
    this.member.new("r", 20);
    this.member.new("graph", new dagre.graphlib.Graph());
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