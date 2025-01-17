export class Context {
    constructor(parent) {
        this.parent = parent;
        this.start = parent.delay();
        this.duration = parent.duration();
        this.isAnimating = parent.isAnimating();
    }
    till(l, r) {
        if (this.isAnimating) {
            const parent = this.parent;
            parent.endAnimate();
            parent.after(this.start + this.duration * l);
            if (r > l + 1e-7) parent.startAnimate(this.duration * (r - l));
        }
    }
    tillc(l, r) {
        return {
            delay: () => this.start + l * this.duration,
            duration: () => (r - l) * this.duration,
        };
    }
    recover() {
        if (this.isAnimating) {
            const parent = this.parent;
            parent.endAnimate();
            parent.after(this.start);
            parent.startAnimate(this.duration);
        }
    }
}
