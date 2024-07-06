import { Box } from "../Element/Box";
import { DAG } from "./DAG";
import { dagreGraphToBox, evaluateValue } from "../../Utility/Tool";
import { trim } from "../../Utility/Trim";
import * as dagre from "dagre";
import { naiveGetterAndSetter } from "../Common";

export function BoxDAG(parent) {
    DAG.call(this, parent);

    this.g().type("BoxDAG");

    this.member.new("elementWidth", 40);
    this.member.new("elementHeight", 40);

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
    this.newNodeByBaseGraph(id, elem);
    return this;
}

function update() {
    dagre.layout(this._.graph);
    const box = dagreGraphToBox(this._.graph);
    const realX = x => {
        if (box.width === 0) return this._.x;
        return this._.x + (x - box.x) / box.width * this._.width;
    }
    const realY = y => {
        if (box.height === 0) return this._.y;
        return this._.y + (y - box.y) / box.height * this._.height;
    }
    const elementWidth = this._.elementWidth;
    const elementHeight = this._.elementHeight;
    this._.graph.nodes().forEach(nodeId => {
        const node = this.findNodeById(nodeId);
        const layout = this._.graph.node(nodeId);
        const x = realX(layout.x);
        const y = realY(layout.y);
        const move = () => {
            node.width(elementWidth);
            node.height(elementHeight);
            node.cx(x).cy(y);
        }
        if (node._.enter) {
            node._.enter(node, move);
            node._.enter = undefined;
        } else move();
    });
    this._.graph.edges().forEach(linkInfo => {
        const x = linkInfo.v;
        const y = linkInfo.w;
        const link = this.findLinkById(x, y);
        const nx = this.findNodeById(x);
        const ny = this.findNodeById(y);
        const move = () => {
            link.source(nx.cx(), nx.cy());
            link.target(ny.cx(), ny.cy());
            trim(link, nx, ny);
        }
        if (link._.enter) {
            link._.enter(link, move);
            link._.enter = undefined;
        } else move();
    });
    this.postUpdate();
    return this;
}