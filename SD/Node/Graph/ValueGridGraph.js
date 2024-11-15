import { Enter }     from "@/Node/SDNode/Enter";
import { GridGraph } from "@/Node/Graph/GridGraph";

export function ValueGridGraph(parent) {
    GridGraph.call(this, parent);

    this.type("ValueGridGraph");
}

ValueGridGraph.prototype = {
    ...GridGraph.prototype
};

ValueGridGraph.prototype.newNode = function(gid, value) {
    const sidToPos = this._.sidToPos;
    const element = value;
    sidToPos[element.id] = { x: this._.curN, y: this._.curM };
    element.onEnter(Enter.ordinary(this, "nodes"));
    this.newNodeByBaseGraph(gid, element);
    return this;
}

ValueGridGraph.prototype.newNodeFromExistElement = function(gid, value) {
    const sidToPos = this._.sidToPos;
    const element = value;
    sidToPos[element.id] = { x: this._.curN, y: this._.curM };
    element.onEnter(Enter.fromExist(this, "nodes"));
    this.newNodeByBaseGraph(gid, element);
    return this;
}

ValueGridGraph.prototype.newNodeFromExistValue = ValueGridGraph.prototype.newNodeFromExistElement;