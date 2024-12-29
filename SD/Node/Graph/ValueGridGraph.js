import { GridGraph } from "@/Node/Graph/GridGraph";
import { Enter as EN } from "@/Node/SDNode/Enter";

export function ValueGridGraph(parent) {
    GridGraph.call(this, parent);

    this.type("ValueGridGraph");
}

ValueGridGraph.prototype = {
    ...GridGraph.prototype
};

ValueGridGraph.prototype.newNode = function(id, value) {
    const sidToPos = this._.sidToPos;
    const element = value;
    sidToPos[element.id] = { x: this._.curN, y: this._.curM };
    element.onEnter(EN.appear("nodes"));
    this.newNodeByBaseGraph(id, element);
    return this;
}

ValueGridGraph.prototype.newNodeFromExistElement = function(id, value) {
    const sidToPos = this._.sidToPos;
    const element = value;
    sidToPos[element.id] = { x: this._.curN, y: this._.curM };
    element.onEnter(EN.moveTo("nodes"));
    this.newNodeByBaseGraph(id, element);
    return this;
}

ValueGridGraph.prototype.newNodeFromExistValue = ValueGridGraph.prototype.newNodeFromExistElement;