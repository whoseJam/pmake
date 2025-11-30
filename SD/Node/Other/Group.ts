import { SDNode } from "@/Node/SDNode";
import { SDSVGNode } from "@/Node/SDSVGNode";

export class Group extends SDSVGNode {
    _: SDSVGNode["_"] & {
        nodes: Array<SDNode>;
    };
    constructor(target: SDSVGNode) {
        super(target);
        this._.nodes = [];
    }
    add(node: SDNode) {
        node.attachTo(this);
        this._.nodes.push(node);
        return this;
    }
    startAnimate() {
        super.startAnimate.apply(this, arguments);
        if (arguments.length !== 3) return this;
        for (const node of this._.nodes) node.startAnimate.apply(node, arguments);
        return this;
    }
    endAnimate() {
        super.endAnimate.apply(this, arguments);
        for (const node of this._.nodes) node.endAnimate.apply(node, arguments);
        return this;
    }
    after() {
        super.after.apply(this, arguments);
        for (const node of this._.nodes) node.after.apply(node, arguments);
        return this;
    }
    nodes() {
        return this._.nodes;
    }
}
