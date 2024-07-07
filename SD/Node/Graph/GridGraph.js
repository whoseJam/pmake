import { evaluateValue } from "@/Utility/Tool";
import { trim } from "@/Utility/Trim";
import { naiveGetterAndSetter } from "../Common";
import { BaseGraph } from "./BaseGraph";

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

GridGraph.prototype.newNode = function(id, value) {
    const element = new this._.nodeType(this.layer("nodes"));
    element.value(evaluateValue(id, value));
    element.posN = this.member.get("curN");
    element.posM = this.member.get("curM");
    element._.enter = (element, move) => {
        element.opacity(0);
        move();
        element.unfreeze().freeze();
        element.startAnimate(this).opacity(1);
    };
    this.newNodeByBaseGraph(id, element);
    return this;
}

GridGraph.prototype.newLink = function(x, y, value) {
    const element = new this._.linkType(this.layer("links"));
    element.value(value);
    element._.enter = (element, move) => {
        element.opacity(0);
        move();
        element.unfreeze().freeze();
        element.startAnimate(this).opacity(1);
    };
    this.newLinkByBaseGraph(x, y, element);
    return this;
}

function update() {
    const x = this.x(), mx = this.mx(), W = (mx - x) / this.member.get("m");
    const y = this.y(), my = this.my(), H = (my - y) / this.member.get("n");
    const convertX = node => node.posM * W + x;
    const convertY = node => node.posN * H + y;
    const nodes = this.member.get("nodes");
    const links = this.member.get("links");
    for (let node of nodes) {
        this.tryMove(node, () => {
            node.cx(convertX(node));
            node.cy(convertY(node));
        });
    }
    for (let link of links) {
        const sourceId = link.fromNodeId;
        const targetId = link.toNodeId;
        const source = this.findNodeById(sourceId);
        const target = this.findNodeById(targetId);
        this.tryMove(link, () => {
            link.source(source.center());
            link.target(target.center());
            trim(link, source, target);
        });
    }
}