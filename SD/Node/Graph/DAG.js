import { dagreGraphToBox } from "../../Utility/Tool";
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
    this._.makeLink = function(node) {
        return new Line(node);
    }
}

DAG.prototype = {
    ...BaseGraph.prototype
};

DAG.prototype.updateList = [
    ...DAG.prototype.updateList,
    update
];

/**
 * 新建一个编号为id，价值为value的节点
 * @param {string|number} id 
 * @param {SDNode|null} value
 * @returns {this}
 */
DAG.prototype.newNode = function(id, value = null) {
    let elem = new Vertex(this.layer("nodes")).r(this.member.get("r"));
    if (value !== null) elem.value(value);
    else elem.value(id);
    elem._.enter = (elem, move) => {
        elem.opacity(0);
        move();
        elem.startAnimate(this).opacity(1);
    };
    const graph = this.member.get("graph");
    graph.setNode(id, {
        label: id,
        width: this.member.get("r") * 2,
        height: this.member.get("r") * 2
    });
    this.newNodeByBaseGraph(id, elem);
    return this;
}

/**
 * 新建一条从x指向y的，价值为value的边，随后交由GraphBase完成信息的存储工作和update的工作
 * @overload
 * @param {number|string} x
 * @param {number|string} y
 * @returns {this}
 * @overload
 * @param {number|string} x 
 * @param {number|string} y 
 * @param {SDNode} value
 * @returns {this}
 */
DAG.prototype.newLink = function(x, y, value = null) {
    let elem = this._.makeLink(this.layer("links"));
    if (value !== null) elem.value(value);
    elem._.enter = (elem, move) => {
        elem.opacity(0);
        move();
        elem.startAnimate(this).opacity(1);
    };
    const graph = this.member.get("graph");
    graph.setEdge(x, y);
    this.newLinkByBaseGraph(x, y, elem);
    return this;
}

/**
 * 操作有向图的布局顺序
 * @param {"TB"|"BT"|"LR"|"RL"} rankDir 
 * @returns {this}
 */
DAG.prototype.rankDir = function(rankDir) {
    if (rankDir === undefined) return this._.rankDir;
    this._.rankDir = rankDir;
    this._.graph.setGraph({ rankdir: rankDir });
    this.dirty(this, "U");
    return this;
}

/**
 * 操作有向图节点的对齐方式
 * @param {"UL"|"UR"|"DL"|"DR"|"C"} align 
 * @returns {this}
 */
DAG.prototype.align = function(align) {
    if (align === undefined) return this._.align;
    this._.align = align;
    this._.graph.setGraph({ align: align });
    this.dirty(this, "U");
    return this;
}

function update() {
    const graph = this.member.get("graph");
    dagre.layout(graph);
    const box = dagreGraphToBox(graph);
    const realX = x => {
        if (box.width === 0) return this.member.get("x");
        return this.member.get("x") + (x - box.x) / box.width * this.member.get("width");
    }
    const realY = y => {
        if (box.height === 0) return this.member.get("y");
        return this.member.get("y") + (y - box.y) / box.height * this.member.get("height");
    }
    graph.nodes().forEach(nodeId => {
        const node = this.findNodeById(nodeId);
        const layout = graph.node(nodeId);
        const move = () => node.cx(realX(layout.x)).cy(realY(layout.y));
        if (node._.enter) {
            node._.enter(node, move);
            node._.enter = undefined;
        } else move();
    });
    graph.edges().forEach(linkInfo => {
        const x = linkInfo.v;
        const y = linkInfo.w;
        const link = this.findLinkById(x, y);
        const nx = this.findNodeById(x);
        const ny = this.findNodeById(y);
        const move = () => {
            link.source(nx.cx(), nx.cy());
            link.target(ny.cx(), ny.cy());
            trim(link, nx, ny);
        }
        if (link._.enter) {
            link._.enter(link, move);
            link._.enter = undefined;
        } else move();
    });
}