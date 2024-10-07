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
    element.onEnter(Enter.Ordinary(this, "nodes"));
    this.newNodeByBaseGraph(id, element);
    return this;
}

GridGraph.prototype.newNodeFromExistValue = function(id, value) {
    const sidToPos = this._.sidToPos;
    const element = new this._.nodeType(this.layer("nodes"));
    sidToPos[element.id] = { x: this._.curN, y: this._.curM };
    element.onEnter(Enter.FromExistValue(this, value, "nodes"));
    this.newNodeByBaseGraph(id, element);
    return this;
}

GridGraph.prototype.newNodeFromExistElement = function(id, value) {
    const sidToPos = this._.sidToPos;
    const element = value;
    sidToPos[element.id] = { x: this._.curN, y: this._.curM };
    element.onEnter(Enter.FromExist(this, "nodes"));
    this.newNodeByBaseGraph(id, element);
    return this;
}

GridGraph.prototype.newLink = function(sourceGid, targetGid, value) {
    const element = new this._.linkType(this.layer("links"));
    element.value(value);
    element.onEnter(Enter.Ordinary(this, "links"));
    this.newLinkByBaseGraph(sourceGid, targetGid, element);
    return this;
}

GridGraph.prototype.newLinkFromExistValue = function(sourceGid, targetGid, value) {
    const element = new this._.linkType(this.layer("links"));
    element.onEnter(Enter.FromExistValue(this, value, "links"));
    this.newLinkByBaseGraph(sourceGid, targetGid, element);
    return this;
    
}

GridGraph.prototype.newLinkFromExistElement = function(sourceGid, targetGid, value) {
    const element = value;
    element.onEnter(Enter.FromExist(this, "links"));
    this.newLinkByBaseGraph(sourceGid, targetGid, element);
    return this;
}

function update() {
    if (this.member.hasChanged("m") ||
        this.member.hasChanged("n") || 
        this.member.hasChanged("width") ||
        this.member.hasChanged("height") ||
        this.member.hasChanged("nodes")) {
        const sidToPos = this._.sidToPos;
        const x = this.x(), mx = this.mx(), W = (mx - x) / this.member.getAndFlush("m");
        const y = this.y(), my = this.my(), H = (my - y) / this.member.getAndFlush("n");
        const convertX = node => sidToPos[node.id].y * W + x;
        const convertY = node => sidToPos[node.id].x * H + y;
        const nodes = this.member.getAndFlush("nodes");
        for (let node of nodes) {
            this.tryMove(node, () => {
                node.cx(convertX(node));
                node.cy(convertY(node));
            });
        }
        this.member.flush("width");
        this.member.flush("height");
    }
    if (this.member.hasChanged("links")) {
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
}