
export function Context(parent) {
    this.parent = parent;
    this.start = parent.delay();
    this.duration = parent.duration();
    this.isAnimating = parent.isAnimating();
}

Context.prototype.till = function(l, r) {
    if (this.isAnimating) {
        const parent = this.parent;
        parent.endAnimate();
        parent.after(this.start + this.duration * l);
        if (r > l + 1e-7) parent.startAnimate(this.duration * (r - l));
    }
}

Context.prototype.tillc = function(l, r) {
    return {
        animate: {
            delay: () => this.start + l * this.duration,
            duration: () => this.start + (r - l) * this.duration
        }
    };
}

Context.prototype.recover = function() {
    if (this.isAnimating) {
        const parent = this.parent;
        parent.endAnimate();
        parent.after(this.start);
        parent.startAnimate(this.duration);
    }
}
