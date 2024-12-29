import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { Enter as EN } from "@/Node/SDNode/Enter";
import { effect } from "@/Node/SDNode/SDValue";
import { Cast } from "@/Utility/Cast";
import { Factory } from "@/Utility/Factory";
import { trim } from "@/Utility/Trim";

export function GridGraph(parent) {
    BaseGraph.call(this, parent);

    this.type("GridGraph");

    this.vars.merge({
        r: 20,
        n: 1,
        m: 1
    });

    this._.curN = 0;
    this._.curM = 0;
    this._.sidToPos = {}; // id of SDNode -> { x: number, y: number }

    this._.updater = effect(() => {
        const sidToPos = this._.sidToPos;
        const x = this.x(), mx = this.mx(), W = (mx - x) / this.m();
        const y = this.y(), my = this.my(), H = (my - y) / this.n();
        const convertX = node => sidToPos[node.id].y * W + x;
        const convertY = node => sidToPos[node.id].x * H + y;
        const nodes = this.vars.nodes;
        for (let node of nodes) {
            node.cx(convertX(node));
            node.cy(convertY(node));
        }
        const links = this.vars.links;
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

GridGraph.prototype = {
    ...BaseGraph.prototype
};

GridGraph.prototype.n = Factory.handler("n");
GridGraph.prototype.m = Factory.handler("m");

GridGraph.prototype.at = function (i, j) {
    this._.curN = i;
    this._.curM = j;
    return this;
}

GridGraph.prototype.newNode = function (id, value) {
    const sidToPos = this._.sidToPos;
    const element = new this._.nodeType(this.layer("nodes"));
    element.value(Cast.castToSDNode(element, value, id));
    sidToPos[element.id] = { x: this._.curN, y: this._.curM };
    element.onEnter(EN.appear("nodes"));
    this.newNodeByBaseGraph(id, element);
    return this;
}

GridGraph.prototype.newNodeFromExistValue = function (id, value) {
    const sidToPos = this._.sidToPos;
    const element = new this._.nodeType(this.layer("nodes"));
    sidToPos[element.id] = { x: this._.curN, y: this._.curM };
    element.onEnter(EN.appear("nodes"));
    this.newNodeByBaseGraph(id, element);
    element.value(value.onEnter(EN.moveTo()));
    return this;
}

GridGraph.prototype.newNodeFromExistElement = function (id, value) {
    const sidToPos = this._.sidToPos;
    const element = value;
    sidToPos[element.id] = { x: this._.curN, y: this._.curM };
    element.onEnter(EN.moveTo("nodes"));
    this.newNodeByBaseGraph(id, element);
    return this;
}

GridGraph.prototype.newLink = function (sourceId, targetId, value) {
    const element = new this._.linkType(this.layer("links"));
    element.value(value);
    element.onEnter(EN.appear("links"));
    this.newLinkByBaseGraph(sourceId, targetId, element);
    return this;
}

GridGraph.prototype.newLinkFromExistValue = function (sourceId, targetId, value) {
    const element = new this._.linkType(this.layer("links"));
    element.onEnter(EN.appear("links"));
    this.newLinkByBaseGraph(sourceId, targetId, element);
    element.value(value.onEnter(EN.moveTo()));
    return this;
}

GridGraph.prototype.newLinkFromExistElement = function (sourceId, targetId, value) {
    const element = value;
    element.onEnter(EN.moveTo("links"));
    this.newLinkByBaseGraph(sourceId, targetId, element);
    return this;
}
