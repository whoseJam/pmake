export class Context {
    constructor(parent) {
        this.parent = parent;
        this.start = parent.delay();
        this.duration = parent.duration();
    }
    till(l, r) {
        if (this.duration > 0) {
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
        if (this.duration > 0) {
            const parent = this.parent;
            parent.endAnimate();
            parent.after(this.start);
            parent.startAnimate(this.duration);
        }
    }
}
