import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { GridGraph } from "@/Node/Graph/GridGraph";
import { Enter as EN } from "@/Node/SDNode/Enter";
import { effect } from "@/Node/SDNode/SDValue";
import { Cast } from "@/Utility/Cast";
import { trim } from "@/Utility/Trim";

export function TinyGraph(parent) {
    BaseGraph.call(this, parent);

    this.type("TinyGraph");

    this._.updater = effect(() => {
        const nodes = this.vars.nodes;
        switch (nodes.length) {
            case 1: update1.call(this, nodes); break;
            case 2: update2.call(this, nodes); break;
            case 3: update3.call(this, nodes); break;
            case 4: update4.call(this, nodes); break;
            case 5: update5.call(this, nodes); break;
            case 6: update6.call(this, nodes); break;
        }
        this.forEachLinks((link, sourceId, targetId) => {
            const source = this.findNodeById(sourceId);
            const target = this.findNodeById(targetId);
            link.source(source.center());
            link.target(target.center());
            trim(link, source, target);
        });
    });
}

TinyGraph.prototype = {
    ...BaseGraph.prototype
};

TinyGraph.prototype.newLink = GridGraph.prototype.newLink;

TinyGraph.prototype.newNode = function(id, value) {
    const element = new this._.nodeType(this.layer("nodes"));
    element.value(Cast.castToSDNode(element, value, id));
    element.onEnter(EN.appear("nodes"));
    this.newNodeByBaseGraph(id, element);
    return this;
}

function update1(nodes) {
    nodes[0].cx(this.cx()).cy(this.cy());
}

function update2(nodes) {
    const w = this.width() / 4;
    nodes[0].cx(this.x() + w).cy(this.cy());
    nodes[1].cx(this.mx() - w).cy(this.cy());
}

function update3(nodes) {
    const w = this.width() / 4;
    const h = this.height() / 4;
    nodes[0].cx(this.cx()).cy(this.y() + h);
    nodes[1].cx(this.x() + w).cy(this.my() - h);
    nodes[2].cx(this.mx() - w).cy(this.my() - h);
}

function update4(nodes) {
    const w = this.width() / 4;
    const h = this.height() / 4;
    nodes[0].cx(this.x() + w).cy(this.y() + h);
    nodes[1].cx(this.x() + w).cy(this.my() - h);
    nodes[2].cx(this.mx() - w).cy(this.my() - h);
    nodes[3].cx(this.mx() - w).cy(this.y() + h);
}

function update5(nodes) {
    nodes[0].cx(this.x()).cy(this.y());
    nodes[1].cx(this.x()).cy(this.my());
    nodes[2].cx(this.mx()).cy(this.my());
    nodes[3].cx(this.mx()).cy(this.y());
    nodes[4].cx(this.cx()).cy(this.cy());
}

function update6(nodes) {
    const w = this.width() / 4;
    const h = this.height() / 4;
    nodes[0].cx(this.cx()).cy(this.y() + h / 2);
    nodes[1].cx(this.x() + w / 2).cy(this.y() + h);
    nodes[2].cx(this.x() + w / 2).cy(this.my() - h);
    nodes[3].cx(this.cx()).cy(this.my() - h / 2);
    nodes[4].cx(this.mx() - w / 2).cy(this.my() - h);
    nodes[5].cx(this.mx() - w / 2).cy(this.y() + h);
}