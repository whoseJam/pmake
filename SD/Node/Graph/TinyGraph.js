import { trim } from "@/Utility/Trim";
import { BaseGraph } from "./BaseGraph";
import { evaluateValue } from "@/Utility/Tool";
import { GridGraph } from "./GridGraph";

export function TinyGraph(parent) {
    BaseGraph.call(this, parent);

    this.g().type("TinyGraph");

    this.member.new("r", 20);

    return this;
}

TinyGraph.prototype = {
    ...BaseGraph.prototype
};

TinyGraph.prototype.newLink = GridGraph.prototype.newLink;

TinyGraph.prototype.updateList = [
    ...TinyGraph.prototype.updateList,
    update_update
];

TinyGraph.prototype.newNode = function(id, value) {
    const element = new this._.nodeType(this.layer("nodes"));
    element.value(evaluateValue(id, value));
    element._.enter = (element, move) => {
        element.opacity(0);
        move();
        element.update();
        element.startAnimate(this).opacity(1);
    };
    this.newNodeByBaseGraph(id, element);
    return this;
}

function update_update() {
    const nodes = this.member.get("nodes");
    const links = this.member.get("links");
    if (nodes.length === 1) update1.call(this, nodes);
    if (nodes.length === 2) update2.call(this, nodes);
    if (nodes.length === 3) update3.call(this, nodes);
    if (nodes.length === 4) update4.call(this, nodes);
    if (nodes.length === 5) update5.call(this, nodes);
    if (nodes.length === 6) update6.call(this, nodes);
    if (nodes.length >= 7) throw new Error("Cannot Process Graph With count(Nodes) >= 7");
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

function update(node, move) {
    if (node._.enter) {
        node._.enter(node, move);
        node._.enter = undefined;
    } else move();
}

function update1(nodes) {
    update.call(this, nodes[0], () => nodes[0].cx(this.cx()).cy(this.cy()));
}

function update2(nodes) {
    const w = this.width() / 4;
    update.call(this, nodes[0], () => nodes[0].cx(this.x() + w).cy(this.cy()));
    update.call(this, nodes[1], () => nodes[1].cx(this.mx() - w).cy(this.cy()));
}

function update3(nodes) {
    const w = this.width() / 4;
    const h = this.height() / 4;
    update.call(this, nodes[0], () => nodes[0].cx(this.cx()).cy(this.y() + h));
    update.call(this, nodes[1], () => nodes[1].cx(this.x() + w).cy(this.my() - h));
    update.call(this, nodes[2], () => nodes[2].cx(this.mx() - w).cy(this.my() - h));
}

function update4(nodes) {
    const w = this.width() / 4;
    const h = this.height() / 4;
    update.call(this, nodes[0], () => nodes[0].cx(this.x() + w).cy(this.y() + h));
    update.call(this, nodes[1], () => nodes[1].cx(this.x() + w).cy(this.my() - h));
    update.call(this, nodes[2], () => nodes[2].cx(this.mx() - w).cy(this.my() - h));
    update.call(this, nodes[3], () => nodes[3].cx(this.mx() - w).cy(this.y() + h));
}

function update5(nodes) {
    update.call(this, nodes[0], () => nodes[0].cx(this.x()).cy(this.y()));
    update.call(this, nodes[1], () => nodes[1].cx(this.x()).cy(this.my()));
    update.call(this, nodes[2], () => nodes[2].cx(this.mx()).cy(this.my()));
    update.call(this, nodes[3], () => nodes[3].cx(this.mx()).cy(this.y()));
    update.call(this, nodes[4], () => nodes[4].cx(this.cx()).cy(this.cy()));
}

function update6(nodes) {
    const w = this._.width / 4;
    const h = this._.height / 4;
    update.call(this, nodes[0], () => nodes[0].cx(this.cx()).cy(this.y() + h / 2));
    update.call(this, nodes[1], () => nodes[1].cx(this.x() + w / 2).cy(this.y() + h));
    update.call(this, nodes[2], () => nodes[2].cx(this.x() + w / 2).cy(this.my() - h));
    update.call(this, nodes[3], () => nodes[3].cx(this.cx()).cy(this.my() - h / 2));
    update.call(this, nodes[4], () => nodes[4].cx(this.mx() - w / 2).cy(this.my() - h));
    update.call(this, nodes[5], () => nodes[5].cx(this.mx() - w / 2).cy(this.y() + h));
}