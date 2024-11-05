import { Cast } from "@/Utility/Cast";

import { DAG }    from "@/Node/Graph/DAG";
import { Box }    from "@/Node/Element/Box";
import { Enter }  from "@/Node/SDNode/Enter";
import { SDNode } from "@/Node/SDNode";

export function BoxDAG(parent) {
    DAG.call(this, parent);

    this.type("BoxDAG");

    this.member.new("elementWidth", 40);
    this.member.new("elementHeight", 40);

    this.member.set("updateNodeSize", (element) => {
        element.width(this.member.get("elementWidth"));
        element.height(this.member.get("elementHeight"));
    })

    this._.nodeType = Box;
}


BoxDAG.prototype = {
    ...DAG.prototype
};

BoxDAG.prototype.elementWidth  = SDNode.OrdinaryGSet("elementWidth", "setByEqual");
BoxDAG.prototype.elementHeight = SDNode.OrdinaryGSet("elementHeight", "setByEqual");

BoxDAG.prototype.newNode = function(id, value = null) {
    const element = new this._.nodeType(this.layer("nodes"));
    element.value(Cast.castToSDNode(element, value, id));
    element.onEnter(Enter.ordinary(this));
    const graph = this.member.get("graph");
    graph.setNode(id, {});
    this.newNodeByBaseGraph(id, element);
    return this;
}