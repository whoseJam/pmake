import { Enter as EN } from "@/Node/Core/Enter";
import { effect } from "@/Node/Core/Reactive";
import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { GridGraph } from "@/Node/Graph/GridGraph";
import { Cast } from "@/Utility/Cast";
import { trim } from "@/Utility/Trim";

export function BipartiteGraph(parent) {
    BaseGraph.call(this, parent);

    this.type("BipartiteGraph");

    this.vars.merge({
        r: 20,
        rank: 0,
        width: 600,
        height: 250,
    });

    this._.updater = effect(() => {
        const nodes = this.vars.nodes;
        const links = this.vars.links;
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
        const gap = [(maxX - minX) / (count[0] + 1), (maxX - minX) / (count[1] + 1)];
        const convertX = node => minX + gap[node.setNo] * currentIndex[node.setNo];
        for (let node of orderedNodes) {
            const x = convertX(node);
            const yLocator = ["y", "my"][node.setNo];
            node.cx(x);
            node[yLocator](this[yLocator]());
            currentIndex[node.setNo]++;
        }
        for (let link of links) {
            const sourceId = this.sourceId(link);
            const targetId = this.targetId(link);
            const source = this.findNodeById(sourceId);
            const target = this.findNodeById(targetId);
            link.source(source.center());
            link.target(target.center());
            trim(link, source, target);
        }
    });
}

BipartiteGraph.prototype = {
    ...BaseGraph.prototype,
};

BipartiteGraph.prototype.newNode = function (id, value, setNo) {
    if (arguments.length === 2) return this.newNode(id, undefined, value);
    const element = new this._.nodeType(this.layer("nodes"));
    element.value(Cast.castToSDNode(element, value, id));
    element.onEnter(EN.appear("nodes"));
    element.setNo = setNo;
    this.newNodeByBaseGraph(id, element);
    return this;
};

BipartiteGraph.prototype.newNodeFromExistElement = function (id, value, setNo) {
    const element = value;
    element.onEnter(EN.moveTo("nodes"));
    element.setNo = setNo;
    this.newNodeByBaseGraph(id, element);
    return this;
};

BipartiteGraph.prototype.newLink = GridGraph.prototype.newLink;
BipartiteGraph.prototype.newLinkFromExistValue = GridGraph.prototype.newLinkFromExistValue;
BipartiteGraph.prototype.newLinkFromExistElement = GridGraph.prototype.newLinkFromExistElement;
