import { trim } from "@/Utility/Trim";
import { Cast } from "@/Utility/Cast";

import { Enter }     from "@/Node/SDNode/Enter";
import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { GridGraph } from "@/Node/Graph/GridGraph";

export function BipartiteGraph(parent) {
    BaseGraph.call(this, parent);

    this.type("BipartiteGraph");

    this.member.new("r", 20);
    this.member.new("rank", 0);
    this.member.new("width", 600);
    this.member.new("height", 250);
}

BipartiteGraph.prototype = {
    ...BaseGraph.prototype
};

BipartiteGraph.prototype.updateList = [
    ...BipartiteGraph.prototype.updateList,
    update
];

BipartiteGraph.prototype.newNode = function(id, value, setNo) {
    if (arguments.length === 2) return this.newNode(id, undefined, value);
    const element = new this._.nodeType(this.layer("nodes"));
    element.value(Cast.castToSDNode(element, value, id));
    element.onEnter(Enter.ordinary(this));
    element.setNo = setNo;
    this.newNodeByBaseGraph(id, element);
    return this;
}

BipartiteGraph.prototype.newNodeFromExistElement = function(id, value, setNo) {
    const element = value;
    element.onEnter(Enter.moveTo());
    element.setNo = setNo;
    this.newNodeByBaseGraph(id, element);
    return this;
}

BipartiteGraph.prototype.newLink                 = GridGraph.prototype.newLink;
BipartiteGraph.prototype.newLinkFromExistValue   = GridGraph.prototype.newLinkFromExistValue;
BipartiteGraph.prototype.newLinkFromExistElement = GridGraph.prototype.newLinkFromExistElement;

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
        const sourceId = this.sourceId(link);
        const targetId = this.targetId(link);
        const source = this.findNodeById(sourceId);
        const target = this.findNodeById(targetId);
        this.tryMove(link, () => {
            link.source(source.center());
            link.target(target.center());
            trim(link, source, target);
        })
    }
}