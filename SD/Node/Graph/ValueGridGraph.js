import { GridGraph } from "@/Node/Graph/GridGraph";

export function ValueGridGraph(parent) {
    GridGraph.call(this, parent);

    this.g().type("ValueGridGraph");

    return this;
}

ValueGridGraph.prototype = {
    ...GridGraph.prototype
};

ValueGridGraph.prototype.newNode = function(id, value) {
    const element = value;
    element.posN = this.member.get("curN");
    element.posM = this.member.get("curM");
    element._.enter = (element, move) => {
        element.opacity(0);
        move();
        element.update();
        element.startAnimate(this).opacity(1);
    };
    this.newNodeByBaseGraph(id, element);
    return this;
}