import { Node } from "./Node";

let id = 0;

export class VirtualNode extends Node {
    constructor(node, hold, rule) {
        super(node);
        this._.hold = hold;
        this._.rule = rule;
        this.children = undefined;
        node.childAs(`virtual_${++id}`, this);
        this._.virtualNodeId = id;
    }

    update() {
        this._.rule();
        return this;
    }

    startAnimate(other = 300, update = true) {
        let hold = this._.hold;
        let parent = this.parent;
        if (!hold.isAnimating()) {
            console.assert(update === false);
            hold.startAnimate(parent, update);
        }
        return this;
    }

    endAnimate(update = true) {
        let hold = this._.hold;
        if (hold.isAnimating()) {
            hold.endAnimate(update);
        }
        return this;
    }
}