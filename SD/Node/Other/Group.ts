import { SDNode } from "@/Node/SDNode";
import { SDSVGNode } from "@/Node/SDSVGNode";

export class Group extends SDSVGNode {
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
        this._.nodes.forEach(node => node.startAnimate.apply(node, arguments));
        return this;
    }
    endAnimate() {
        super.endAnimate.apply(this, arguments);
        this._.nodes.forEach(node => node.endAnimate.apply(node, arguments));
        return this;
    }
    after() {
        super.after.apply(this, arguments);
        this._.nodes.forEach(node => node.after.apply(node, arguments));
        return this;
    }
    nodes() {
        return this._.nodes;
    }
}
