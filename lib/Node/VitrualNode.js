import { SDNode } from "./Node";

let id = 0;

export class VirtualNode extends SDNode {
    constructor(node, hold, rule) {
        super(node);
        this._.hold = hold;
        this._.rule = rule;
        node.childAs(`virtual_${++id}`, this);
        this._.virtualNodeId = id;
    }

    update() {
        this._.rule();
        return this;
    }

    startAnimate() {
        let hold = this._.hold;
        let parent = this.parent;
        if (!hold.isAnimating()) {
            // console.assert(update === false);
            hold.startAnimate(parent);
        }
        return this;
    }

    endAnimate() {
        let hold = this._.hold;
        if (hold.isAnimating()) {
            hold.endAnimate();
        }
        return this;
    }
}