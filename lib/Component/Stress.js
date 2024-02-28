
export function Stress(node) {
    node.stress = function() {
        let cx = this.cx();
        let cy = this.cy();
        let width = this.width();
        if (this.isAnimating()) {
            let s = this.delay(), l = this.duration();
            this.endAnimate().after(s);
            this.startAnimate(l/2);
            this.width(width * 1.2).cx(cx).cy(cy);
            this.endAnimate();
            this.startAnimate(l/2);
            this.width(width).cx(cx).cy(cy);
            this.endAnimate();
            this.after(s).startAnimate(l);
        }
        return this;
    }
    return node;
}