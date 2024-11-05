import { trim } from "@/Utility/Trim";
import { Cast } from "@/Utility/Cast";

import { Enter }     from "@/Node/SDNode/Enter";
import { SDNode }    from "@/Node/SDNode";
import { BaseGraph } from "@/Node/Graph/BaseGraph";

export function GridGraph(parent) {
    BaseGraph.call(this, parent);

    this.type("GridGraph");

    this.member.new("r", 20);
    this.member.new("n", 1);
    this.member.new("m", 1);
    
    this._.curN = 0;
    this._.curM = 0;
    this._.sidToPos = {}; // id of SDNode -> { x: number, y: number }
}

GridGraph.prototype = {
    ...BaseGraph.prototype
};

GridGraph.prototype.n = SDNode.OrdinaryGSet("n", "set");
GridGraph.prototype.m = SDNode.OrdinaryGSet("m", "set");

GridGraph.prototype.updateList = [
    ...GridGraph.prototype.updateList,
    update
];

GridGraph.prototype.at = function(i, j) {
    this._.curN = i;
    this._.curM = j;
    return this;
}

GridGraph.prototype.newNode = function(id, value) {
    const sidToPos = this._.sidToPos;
    const element = new this._.nodeType(this.layer("nodes"));
    element.value(Cast.castToSDNode(element, value, id));
    sidToPos[element.id] = { x: this._.curN, y: this._.curM };
    element.onEnter(Enter.ordinary(this, "nodes"));
    this.newNodeByBaseGraph(id, element);
    return this;
}

GridGraph.prototype.newNodeFromExistValue = function(id, value) {
    const sidToPos = this._.sidToPos;
    const element = new this._.nodeType(this.layer("nodes"));
    sidToPos[element.id] = { x: this._.curN, y: this._.curM };
    element.onEnter(Enter.fromExistValue(this, value, "nodes"));
    this.newNodeByBaseGraph(id, element);
    return this;
}

GridGraph.prototype.newNodeFromExistElement = function(id, value) {
    const sidToPos = this._.sidToPos;
    const element = value;
    sidToPos[element.id] = { x: this._.curN, y: this._.curM };
    element.onEnter(Enter.fromExist(this, "nodes"));
    this.newNodeByBaseGraph(id, element);
    return this;
}

GridGraph.prototype.newLink = function(sourceId, targetId, value) {
    const element = new this._.linkType(this.layer("links"));
    element.value(value);
    element.onEnter(Enter.ordinary(this, "links"));
    this.newLinkByBaseGraph(sourceId, targetId, element);
    return this;
}

GridGraph.prototype.newLinkFromExistValue = function(sourceId, targetId, value) {
    const element = new this._.linkType(this.layer("links"));
    element.onEnter(Enter.fromExistValue(this, value));
    this.newLinkByBaseGraph(sourceId, targetId, element);
    return this;
}

GridGraph.prototype.newLinkFromExistElement = function(sourceId, targetId, value) {
    const element = value;
    element.onEnter(Enter.fromExist(this, "links"));
    this.newLinkByBaseGraph(sourceId, targetId, element);
    return this;
}

function update() {
    const locationChanged = 
        this.member.hasChanged("m") ||
        this.member.hasChanged("n") || 
        this.member.hasChanged("x") ||
        this.member.hasChanged("y") ||
        this.member.hasChanged("width") ||
        this.member.hasChanged("height");
    if (locationChanged || this.member.hasChanged("nodes")) {
        const sidToPos = this._.sidToPos;
        const x = this.x(), mx = this.mx(), W = (mx - x) / this.m();
        const y = this.y(), my = this.my(), H = (my - y) / this.n();
        const convertX = node => sidToPos[node.id].y * W + x;
        const convertY = node => sidToPos[node.id].x * H + y;
        const nodes = this.member.getAndFlush("nodes");
        for (let node of nodes) {
            this.tryMove(node, () => {
                node.cx(convertX(node));
                node.cy(convertY(node));
            });
        }
    }
    if (locationChanged || this.member.hasChanged("links")) {
        const links = this.member.getAndFlush("links");
        for (let link of links) {
            const sourceId = this.sourceId(link);
            const targetId = this.targetId(link);
            const source = this.findNodeById(sourceId);
            const target = this.findNodeById(targetId);
            this.tryMove(link, () => {
                link.source(source.center());
                link.target(target.center());
                trim(link, source, target);
            });
        }
    }
    this.member.flush("m");
    this.member.flush("n");
    this.member.flush("x");
    this.member.flush("y");
    this.member.flush("width");
    this.member.flush("height");
}