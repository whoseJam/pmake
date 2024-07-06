import { trim } from "../../Utility/Trim";
import { Line } from "../Nake/Line";
import { naiveGetterAndSetter, naiveUpdate } from "../Common";
import { Vertex } from "../Element/Vertex";
import { BaseGraph, GraphBase } from "./BaseGraph";

export function GridGraph(parent) {
    BaseGraph.call(this, parent);

    this.g().type("GridGraph");

    this.member.new("r", 20);
    this.member.new("n", 1);
    this.member.new("m", 1);
    this.member.new("curN", 0);
    this.member.new("curM", 0);

    return this;
}

GridGraph.prototype = {
    ...BaseGraph.prototype
};

GridGraph.prototype.n = naiveGetterAndSetter("n", "set");
GridGraph.prototype.m = naiveGetterAndSetter("m", "set");

GridGraph.prototype.updateList = [
    ...GridGraph.prototype.updateList,
    update
];

GridGraph.prototype.at = function(i, j) {
    this.member.setAndFlush("curN", i);
    this.member.setAndFlush("curM", j);
    return this;
}

GridGraph.prototype.newNode = function(id, value = null) {
    let elem = new this._.nodeType(this);
    if (value !== null) elem.value(value);
    else elem.value(id);
    elem.posN = this.member.get("curN");
    elem.posM = this.member.get("curM");
    elem._.enter = (elem, move) => {
        elem.opacity(0);
        move();
        elem.unfreeze().freeze();
        elem.startAnimate(this).opacity(1);
    };
    this.newNodeByBaseGraph(id, elem);
    return this;
}

GridGraph.prototype.newLink = function(x, y, value = null) {
    let elem = new this._.linkType(this);
    if (value !== null) elem.value(value);
    elem._.enter = (elem, move) => {
        elem.opacity(0);
        move();
        elem.unfreeze().freeze();
        elem.startAnimate(this).opacity(1);
    };
    this.newLinkByBaseGraph(x, y, elem);
    return this;
}

function update() {
    const x = this.x(), mx = this.mx(), W = (mx - x) / this.member.get("m");
    const y = this.y(), my = this.my(), H = (my - y) / this.member.get("n");
    const realX = node => node.posM * W + x;
    const realY = node => node.posN * H + y;
    for (let node of this.member.get("nodes")) {
        this.tryMove(node, () => {
            node.cx(realX(node));
            node.cy(realY(node));
        });
    }
    for (let link of this.member.get("links")) {
        const nx = this.findNodeById(link.fromNodeId);
        const ny = this.findNodeById(link.toNodeId);
        this.tryMove(link, () => {
            link.source(nx.cx(), nx.cy());
            link.target(ny.cx(), ny.cy());
            trim(link, nx, ny);
        });
    }
}