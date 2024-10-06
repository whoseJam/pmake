import { trim }             from "@/Utility/Trim";
import { SelectValidValue } from "@/Utility/Cast";

import { BaseGraph } from "@/Node/Graph/BaseGraph";

export function BipartiteGraph(parent) {
    BaseGraph.call(this, parent);

    this.member.new("r", 20);
    this.member.new("rank", 0);
    this.member.new("width", 600);
    this.member.new("height", 250);

    return this;
}

BipartiteGraph.prototype = {
    ...BaseGraph.prototype
};

BipartiteGraph.prototype.updateList = [
    ...BipartiteGraph.prototype.updateList,
    update
];

BipartiteGraph.prototype.newNode = function(id, value, setNo) {
    if (arguments.length === 2) {
        return this.newNode(id, undefined, value);
    }
    const element = new this._.nodeType(this.layer("nodes"));
    element.value(SelectValidValue(value, id));
    element.setNo = setNo;
    element._.enter = (element, move) => {
        element.opacity(0);
        move();
        element.update();
        element.startAnimate(this).opacity(1);
    };
    this.newNodeByBaseGraph(id, element);
    return this;
}

BipartiteGraph.prototype.newLink = function(x, y, value) {
    const element = new this._.linkType(this.layer("links"));
    element.value(value);
    element._.enter = (element, move) => {
        element.opacity(0);
        move();
        element.update();
        element.startAnimate(this).opacity(1);
    };
    this.newLinkByBaseGraph(x, y, element);
    return this;
}

function update() {
    const nodes = this.member.get("nodes");
    const links = this.member.get("links");
    const orderedNodes = [];
    const count = [0, 0];
    const currentIndex = [1, 1];
    for (let node of nodes) {
        orderedNodes.push(node);
        count[node.setNo]++;
    }
    orderedNodes.sort((nodeA, nodeB) => {
        return nodeA.rank - nodeB.rank;
    });
    const minX = this.x();
    const maxX = this.mx();
    const gap = [
        (maxX - minX) / (count[0] + 1),
        (maxX - minX) / (count[1] + 1)
    ];
    const convertX = node => minX + gap[node.setNo] * currentIndex[node.setNo];
    for (let node of orderedNodes) {
        const x = convertX(node);
        const yLocator = ["y", "my"][node.setNo];
        this.tryMove(node, () => {
            node.cx(x);
            node[yLocator](this[yLocator]());
        });
        currentIndex[node.setNo]++;
    }
    for (let link of links) {
        const sourceId = link.fromNodeId;
        const targetId = link.Cast.castToSDNodeId;
        const source = this.findNodeById(sourceId);
        const target = this.findNodeById(targetId);
        this.tryMove(link, () => {
            link.source(source.center());
            link.target(target.center());
            trim(link, source, target);
        })
    }
}