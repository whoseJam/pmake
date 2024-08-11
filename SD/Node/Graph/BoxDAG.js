import { SelectValidValue } from "@/Utility/Cast";

import { DAG }                  from "@/Node/Graph/DAG";
import { Box }                  from "@/Node/Element/Box";
import { GetterAndSetter } from "@/Node/Common";

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

BoxDAG.prototype.elementWidth  = GetterAndSetter("elementWidth", "setByEqual");
BoxDAG.prototype.elementHeight = GetterAndSetter("elementHeight", "setByEqual");

BoxDAG.prototype.newNode = function(id, value = null) {
    const element = new Box(this.layer("nodes"));
    element.value(SelectValidValue(value, id));
    element._.enter = (element, move) => {
        element.opacity(0);
        move();
        element.update();
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