
export class Context {
    constructor(node) {
        this.node = node;
        this.start = node.delay();
        this.duration = node.duration();
        this.isAnimating = node.isAnimating();
    }

    till(l, r) {
        if (this.isAnimating) {
            let node = this.node;
            node.endAnimate();
            node.after(this.start + this.duration * l);
            if (r > l + 1e-7) node.startAnimate(this.duration * (r - l));
        }
    }

    tillc(l, r) {
        return {
            _: {
                animateL: this.start + l * this.duration,
                animateR: this.start + r * this.duration
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