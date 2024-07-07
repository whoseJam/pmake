import { Box } from "../Element/Box";
import { DAG } from "./DAG";
import { evaluateValue } from "../../Utility/Tool";
import { naiveGetterAndSetter } from "../Common";

export function BoxDAG(parent) {
    DAG.call(this, parent);

    this.g().type("BoxDAG");

    this.member.new("elementWidth", 40);
    this.member.new("elementHeight", 40);

    this.member.set("updateNodeSize", (element) => {
        element.width(this.member.get("elementWidth"));
        element.height(this.member.get("elementHeight"));
    })

    return this;
}


BoxDAG.prototype = {
    ...DAG.prototype
};

BoxDAG.prototype.elementWidth  = naiveGetterAndSetter("elementWidth", "setByEqual");
BoxDAG.prototype.elementHeight = naiveGetterAndSetter("elementHeight", "setByEqual");

BoxDAG.prototype.newNode = function(id, value = null) {
    const element = new Box(this.layer("nodes"));
    element.value(evaluateValue(id, value));
    element._.enter = (element, move) => {
        element.opacity(0);
        move();
        element.freeze().unfreeze();
        element.startAnimate(this).opacity(1);
    };
    const graph = this.member.get("graph");
    graph.setNode(id, {
        label: id,
        width: this.member.get("elementWidth"),
        height: this.member.get("elementHeight")
    });
    this.newNodeByBaseGraph(id, element);
    return this;
}