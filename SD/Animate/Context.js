import { SDNode } from "@/Node/SDNode";

/**
 * @class Context
 */
export class Context {
    /**
     * @param {SDNode} node 
     */
    constructor(node) {
        this.node = node;
        this.start = node.delay();
        this.duration = node.duration();
        this.isAnimating = node.isAnimating();
    }

    /**
     * @param {number} l 
     * @param {number} r 
     */
    till(l, r) {
        if (this.isAnimating) {
            let node = this.node;
            node.endAnimate();
            node.after(this.start + this.duration * l);
            if (r > l + 1e-7) node.startAnimate(this.duration * (r - l));
        }
    }

    /**
     * @param {number} l 
     * @param {number} r 
     * @returns {{animate: {delay: () => number, duration: () => number}}}
     */
    tillc(l, r) {
        return {
            animate: {
                delay: () => this.start + l * this.duration,
                duration: () => this.start + (r - l) * this.duration
            }
        };
    }

    recover() {
        if (this.isAnimating) {
            let node = this.node;
            node.endAnimate();
            node.after(this.start);
            node.startAnimate(this.duration);
        }
    }
}